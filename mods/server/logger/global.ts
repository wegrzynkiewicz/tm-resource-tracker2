import { Breaker } from "../../common/asserts.ts";
import { ServiceResolver } from "../../common/dependency.ts";
import { BasicLogger } from "./basic-logger.ts";
import { provideMainLogBus } from "./log-bus.ts";

export type LoggerData = Record<string, unknown>;

export const enum LogSeverity {
  SILLY = 1,
  DEBUG = 2,
  INFO = 3,
  NOTICE = 4,
  WARN = 5,
  ERROR = 6,
  FATAL = 7,
}

export const logSeverityNames: Record<LogSeverity, string> = {
  [LogSeverity.SILLY]: "SILLY",
  [LogSeverity.DEBUG]: "DEBUG",
  [LogSeverity.INFO]: "INFO",
  [LogSeverity.NOTICE]: "NOTICE",
  [LogSeverity.WARN]: "WARN",
  [LogSeverity.ERROR]: "ERROR",
  [LogSeverity.FATAL]: "FATAL",
} as const;

export const mapSeverityToConsoleMethod: Record<LogSeverity, (...args: unknown[]) => void> = {
  [LogSeverity.SILLY]: console.debug,
  [LogSeverity.DEBUG]: console.debug,
  [LogSeverity.INFO]: console.info,
  [LogSeverity.NOTICE]: console.info,
  [LogSeverity.WARN]: console.warn,
  [LogSeverity.ERROR]: console.error,
  [LogSeverity.FATAL]: console.error,
} as const;

export interface Logger {
  silly(message: string, data?: LoggerData): void;
  debug(message: string, data?: LoggerData): void;
  info(message: string, data?: LoggerData): void;
  notice(message: string, data?: LoggerData): void;
  warn(message: string, data?: LoggerData): void;
  error(message: string, data?: LoggerData): void;
  fatal(message: string, data?: LoggerData): void;
}

export interface Log {
  channel: string;
  data: LoggerData;
  date: Date;
  severity: LogSeverity;
  message: string;
}

export interface LogFilter {
  filter(log: Log): boolean;
}

export interface LogFormatter {
  format(log: Log): string;
}

export function provideLogger(): Logger {
  throw new Breaker("logger-must-be-injected");
}
