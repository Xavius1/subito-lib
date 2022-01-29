import type { GatewayInterface, GatewayContext } from '../Gateway/Gateway.js';
declare type LoggerCode = string | number | null;
export declare class Logger {
    private gateway?;
    private trigger?;
    private context?;
    constructor();
    setGateway(gateway: GatewayInterface): void;
    setContext(context: any): this;
    save(query: string, code: LoggerCode, message: string, input: any, { headers, viewer, app, gateway, }?: GatewayContext): Promise<any>;
    newInfo(message: string, context?: any): Promise<any>;
    newError(code: LoggerCode, message: string, input: any, context?: any): Promise<any>;
    newWarning(code: LoggerCode, message: string, input: any, context?: any): Promise<any>;
    newAccess(code: LoggerCode, message: string, input: any, context?: any): Promise<any>;
}
declare const _default: Logger;
export default _default;
//# sourceMappingURL=Logger.d.ts.map