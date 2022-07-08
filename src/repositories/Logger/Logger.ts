import LOG_ACCESS from './queries/LOG_ACCESS';
import LOG_INFO from './queries/LOG_INFO';
import LOG_ERROR from './queries/LOG_ERROR';
import LOG_WARNING from './queries/LOG_WARNING';
import type { IGraphqlClient, GraphqlContext } from '../Graphql/GraphqlClient';

const getTraceStack = function getTraceStack() {
  return Error().stack?.replace(/^Error\n/, '');
};

type LoggerCode = string | number | null

export interface ILogger {
  setGraphql(gateway: IGraphqlClient): ILogger
  setContext(context: any): ILogger
  newInfo(message: string, context: any): any
  newError(code: LoggerCode, message: string, input?: any, context?: any): any
  newWarning(code: LoggerCode, message: string, input?: any, context?: any): any
  newAccess(code: LoggerCode, message: string, input?: any, context?: any): any
}

export class Logger implements ILogger {
  private gateway?: IGraphqlClient;

  private trigger?: string;

  private context?: any;

  constructor() {
    this.context = {};
  }

  setGraphql(gateway: IGraphqlClient) {
    this.gateway = gateway;
    this.trigger = this.gateway?.getClientName() || 'unknown';
    return this;
  }

  setContext(context: any) {
    this.context = context;
    return this;
  }

  static consoleLog(message: string) {
    console.log('[INFO] Graphql unavailable at this time.'); // eslint-disable-line no-console
    console.log(message); // eslint-disable-line no-console
  }

  /**
   * @internal
   */
  private async save(query: string, code: LoggerCode, message: string, input: any, {
    headers, viewer, app, gateway: gatewayName,
  }: GraphqlContext = {}) {
    try {
      const { gateway, trigger } = this;
      if (!gateway) {
        Logger.consoleLog(`[${code}] ${message}`);
        return null;
      }

      if (headers) {
        gateway?.setCustomHeaders(headers);
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
