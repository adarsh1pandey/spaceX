/**
 * Simple logger utility for debugging and error tracking
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private logLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR;

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(`🐛 [DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`ℹ️ [INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`⚠️ [WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`❌ [ERROR] ${message}`, error, ...args);
    }
  }

  apiRequest(method: string, url: string, params?: unknown): void {
    this.debug(`API ${method.toUpperCase()} ${url}`, params);
  }

  apiResponse(status: number, url: string, data?: unknown): void {
    this.debug(`API Response ${status} ${url}`, data);
  }

  apiError(method: string, url: string, error: Error): void {
    this.error(`API ${method.toUpperCase()} ${url} failed`, error);
  }
}

export const logger = new Logger();
export default logger;
