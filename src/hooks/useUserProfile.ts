import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, DbUserProfile, fromDbProfile } from '@/types/billing';
import { logger } from '@/lib/logger';
import { withRetry } from '@/lib/supabaseRetry';

const log = logger.withContext('UserProfile');

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(!!user);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await withRetry(
        async () =>
          await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
        'fetchUserProfile'
      );

      if (fetchError) {
        // Profile doesn't exist yet — create one (for users created before trigger)
        if (fetchError.code === 'PGRST116') {
          log.info('No profile found, creating one');
          const { data: newProfile, error: insertError } = await withRetry(
            async () =>
              await supabase
                .from('user_profiles')
                .insert({ user_id: user.id, subscription_tier: 'free' })
                .select()
                .single(),
            'createUserProfile'
          );

          if (insertError) {
            log.error('Failed to create user profile', insertError);
            setError(insertError.message);
            setIsLoading(false);
            return;
          }

          if (newProfile) {
            setProfile(fromDbProfile(newProfile as DbUserProfile));
          }
          setIsLoading(false);
          return;
        }

        log.error('Failed to fetch user profile', fetchError);
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        setProfile(fromDbProfile(data as DbUserProfile));
      }
    } catch (err) {
      log.error('Failed to fetch user profile after retries', err);
      setError(err instanceof Error ? err.message : 'Error fetching profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
};
