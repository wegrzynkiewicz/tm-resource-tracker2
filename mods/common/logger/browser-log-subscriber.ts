import { Log, LogFilter, mapSeverityToConsoleMethod } from "./global.ts";
import { LogBusSubscriber } from "./log-bus.ts";

export class BrowserLogSubscriber implements LogBusSubscriber {
  public constructor(
    private readonly filter: LogFilter,
  ) {}

  public async subscribe(log: Log): Promise<void> {
    if (this.filter.filter(log) === false) {
      return;
    }
    const { channel, data, severity, message } = log;
    const method = mapSeverityToConsoleMethod[severity];
    method.call(console, `[${channel}] ${message}`, data);
  }
}
