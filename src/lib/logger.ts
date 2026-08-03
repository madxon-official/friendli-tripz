/**
 * Enterprise Production Logger for Friendli Tripz
 * Standardized JSON structured logging with requestId, context, and severity levels.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogContext {
  requestId?: string;
  route?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error | unknown) {
    const payload: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      level,
      message,
      ...context,
    };

    if (error) {
      if (error instanceof Error) {
        payload.error = {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        };
      } else {
        payload.error = error;
      }
    }

    return JSON.stringify(payload);
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatLog('info', message, context));
  }

  warn(message: string, context?: LogContext, error?: Error | unknown) {
    console.warn(this.formatLog('warn', message, context, error));
  }

  error(message: string, context?: LogContext, error?: Error | unknown) {
    console.error(this.formatLog('error', message, context, error));
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLog('debug', message, context));
    }
  }
}

export const logger = new Logger();
