import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const log = logger.withContext('StripeCheckout');

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (priceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-checkout-session',
        { body: { priceId } }
      );

      if (fnError) {
        log.error('Checkout session creation failed', fnError);
        throw fnError;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      log.error('Checkout error', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const openPortal = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-portal-session',
        {}
      );

      if (fnError) {
        log.error('Portal session creation failed', fnError);
        throw fnError;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Portal access failed';
      log.error('Portal error', err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, openPortal, isLoading, error };
};
