import LOG_ACCESS from './queries/LOG_ACCESS.js';
import LOG_INFO from './queries/LOG_INFO.js';
import LOG_ERROR from './queries/LOG_ERROR.js';
import LOG_WARNING from './queries/LOG_WARNING.js';
import type { GatewayInterface, GatewayContext } from '../Gateway/Gateway.js';

const getTraceStack = function getTraceStack() {
  return Error().stack?.replace(/^Error\n/, '');
};

type LoggerCode = string | number | null

export interface ILogger {
  setGateway(gateway: GatewayInterface): ILogger
  setContext(context: any): ILogger
  newInfo(message: string, context: any): any
  newError(code: LoggerCode, message: string, input?: any, context?: any): any
  newWarning(code: LoggerCode, message: string, input?: any, context?: any): any
  newAccess(code: LoggerCode, message: string, input?: any, context?: any): any
}

export class Logger implements ILogger {
  private gateway?: GatewayInterface;

  private trigger?: string;

  private context?: any;

  constructor() {
    this.context = {};
  }

  setGateway(gateway: GatewayInterface) {
    this.gateway = gateway;
    this.trigger = this.gateway?.args?.service || 'unknown';
    return this;
  }

  setContext(context: any) {
    this.context = context;
    return this;
  }

  static consoleLog(message: string) {
    console.log('[INFO] Gateway unavailable at this time.'); // eslint-disable-line no-console
    console.log(message); // eslint-disable-line no-console
  }

  /**
   * @internal
   */
  private async save(query: string, code: LoggerCode, message: string, input: any, {
    headers, viewer, app, gateway: gatewayName,
  }: GatewayContext = {}) {
    try {
      const { gateway, trigger } = this;
      if (!gateway) {
        Logger.consoleLog(`[${code}] ${message}`);
        return null;
      }

      if (headers) {
        gateway?.setHeaders(headers);
      }

      return gateway?.execute(query, {
        code,
        message,
        input,
        trigger,
        trace: getTraceStack(),
        context: {
          headers, viewer, app, gatewayName,
        },
      });
    } catch (err) {
      Logger.consoleLog(`[${code}] ${message}`);
    }

    return null;
  }

  async newInfo(message: string, context = this.context) {
    return this.save(
      LOG_INFO,
      null,
      message,
      null,
      context,
    );
  }

  async newError(code: LoggerCode, message: string, input: any, context = this.context) {
    return this.save(
      LOG_ERROR,
      code,
      message,
      input,
      context,
    );
  }

  async newWarning(code: LoggerCode, message: string, input: any, context = this.context) {
    return this.save(
      LOG_WARNING,
      code,
      message,
      input,
      context,
    );
  }

  async newAccess(code: LoggerCode, message: string, input: any, context = this.context) {
    return this.save(
      LOG_ACCESS,
      code,
      `${this.trigger}>${message}`,
      input,
      context,
    );
  }
}

export default new Logger();
