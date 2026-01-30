/**
 * Supabase retry wrapper with exponential backoff
 * Automatically retries failed requests due to network issues
 */

import { logger } from './logger';

const log = logger.withContext('SupabaseRetry');

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
};

// Errors that should trigger a retry
const RETRYABLE_ERRORS = [
  'fetch failed',
  'network',
  'timeout',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'socket hang up',
  'aborted',
];

function isRetryableError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return RETRYABLE_ERRORS.some((retryable) => message.includes(retryable.toLowerCase()));
}

function calculateDelay(attempt: number, config: RetryConfig): number {
  // Exponential backoff with jitter
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelayMs);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps a Supabase operation with retry logic
 * @param operation - Async function that returns a Supabase response
 * @param operationName - Name for logging purposes
 * @param config - Optional retry configuration
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let lastError: unknown;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      const result = await operation();

      // Check if result has an error property (Supabase responses)
      if (result && typeof result === 'object' && 'error' in result) {
        const supabaseResult = result as { error: unknown };
        if (supabaseResult.error && isRetryableError(supabaseResult.error)) {
          throw supabaseResult.error;
        }
      }

      if (attempt > 0) {
        log.info(`${operationName} succeeded after ${attempt} retries`);
      }

      return result;
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        // Non-retryable error, throw immediately
        log.error(`${operationName} failed with non-retryable error`, error);
        throw error;
      }

      if (attempt < finalConfig.maxRetries) {
        const delay = calculateDelay(attempt, finalConfig);
        log.warn(
          `${operationName} failed (attempt ${attempt + 1}/${finalConfig.maxRetries + 1}), retrying in ${Math.round(delay)}ms`,
          error
        );
        await sleep(delay);
      } else {
        log.error(`${operationName} failed after ${finalConfig.maxRetries + 1} attempts`, error);
      }
    }
  }

  throw lastError;
}

/**
 * Creates a retry-wrapped version of a Supabase query builder method
 */
export function createRetryableQuery<TArgs extends unknown[], TResult>(
  queryFn: (...args: TArgs) => Promise<TResult>,
  operationName: string,
  config?: Partial<RetryConfig>
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withRetry(() => queryFn(...args), operationName, config);
}
