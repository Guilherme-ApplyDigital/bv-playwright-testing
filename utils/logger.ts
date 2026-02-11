import { test as baseTest } from '@playwright/test';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}][${this.context}][${level.toUpperCase()}] ${message}`;
  }

  log(level: LogLevel, message: string): void {
    // Logs will appear in the terminal via console.log
    console.log(this.format(level, message));
  }

  info(message: string): void {
    this.log('info', message);
  }

  warn(message: string): void {
    this.log('warn', message);
  }

  error(message: string): void {
    this.log('error', message);
  }

  debug(message: string): void {
    this.log('debug', message);
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Optional helper to log within tests without importing Logger everywhere.
export const testLogger = createLogger('Test');

