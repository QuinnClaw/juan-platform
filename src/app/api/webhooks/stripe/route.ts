import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;

        // Get subscription to determine tier
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = subscription.items.data[0]?.price.id;

        let tier: 'pro' | 'business' = 'pro';
        if (
          priceId === process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID ||
          priceId === process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID
        ) {
          tier = 'business';
        }

        await supabase
          .from('users')
          .upsert({
            id: userId,
            subscription_tier: tier,
            stripe_customer_id: session.customer as string,
          });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!user) break;

        if (subscription.status === 'active') {
          const priceId = subscription.items.data[0]?.price.id;
          let tier: 'pro' | 'business' = 'pro';
          if (
            priceId === process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID ||
            priceId === process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID
          ) {
            tier = 'business';
          }

          await supabase
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', user.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ subscription_tier: 'free' })
            .eq('id', user.id);
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
