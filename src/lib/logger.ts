/**
 * Centralized logging system
 * In production, this can be extended to send logs to external services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: Date;
}

interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  // Future: add external service configs here
  // sentryDsn?: string;
  // logRocketAppId?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Default config - can be overridden
let config: LoggerConfig = {
  minLevel: import.meta.env.DEV ? 'debug' : 'warn',
  enableConsole: true,
};

// In-memory log buffer (useful for debugging)
const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 100;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function addToBuffer(entry: LogEntry): void {
  logBuffer.push(entry);
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift();
  }
}

function formatMessage(entry: LogEntry): string {
  const prefix = entry.context ? `[${entry.context}]` : '';
  return `${prefix} ${entry.message}`;
}

function log(level: LogLevel, message: string, context?: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    context,
    data,
    timestamp: new Date(),
  };

  addToBuffer(entry);

  if (config.enableConsole) {
    const formattedMessage = formatMessage(entry);
    const consoleMethod = level === 'debug' ? 'log' : level;

    if (data !== undefined) {
      console[consoleMethod](formattedMessage, data);
    } else {
      console[consoleMethod](formattedMessage);
    }
  }

  // Future: Send to external service
  // if (level === 'error' && config.sentryDsn) {
  //   Sentry.captureException(data instanceof Error ? data : new Error(message));
  // }
}

export const logger = {
  debug: (message: string, context?: string, data?: unknown) =>
    log('debug', message, context, data),

  info: (message: string, context?: string, data?: unknown) => log('info', message, context, data),

  warn: (message: string, context?: string, data?: unknown) => log('warn', message, context, data),

  error: (message: string, context?: string, data?: unknown) =>
    log('error', message, context, data),

  // Get recent logs (useful for debugging)
  getRecentLogs: (count = 20): LogEntry[] => logBuffer.slice(-count),

  // Configure the logger
  configure: (newConfig: Partial<LoggerConfig>): void => {
    config = { ...config, ...newConfig };
  },

  // Create a logger with a fixed context
  withContext: (context: string) => ({
    debug: (message: string, data?: unknown) => log('debug', message, context, data),
    info: (message: string, data?: unknown) => log('info', message, context, data),
    warn: (message: string, data?: unknown) => log('warn', message, context, data),
    error: (message: string, data?: unknown) => log('error', message, context, data),
  }),
};

// Export type for context loggers
export type ContextLogger = ReturnType<typeof logger.withContext>;
