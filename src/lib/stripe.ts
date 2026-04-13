import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
});

export const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  business_monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID!,
  business_yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID!,
};
