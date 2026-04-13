'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    await supabase
      .from('users')
      .upsert({
        id: user.id,
        display_name: displayName,
      });

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tierVariant = profile?.subscription_tier === 'pro' ? 'pro'
    : profile?.subscription_tier === 'business' ? 'business' : 'default';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>

      <div className="space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
            </div>

            <Input
              id="displayName"
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900 dark:text-white">Current Plan</p>
                <Badge variant={tierVariant}>
                  {(profile?.subscription_tier || 'free').toUpperCase()}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {profile?.subscription_tier === 'free'
                  ? 'Upgrade to unlock unlimited plans and analytics'
                  : `You're on the ${profile?.subscription_tier} plan`}
              </p>
            </div>
            {profile?.subscription_tier === 'free' && (
              <a href="/pricing">
                <Button variant="primary" size="sm">Upgrade</Button>
              </a>
            )}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
}
