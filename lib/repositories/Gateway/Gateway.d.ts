import { Headers } from 'graphql-request/dist/types.dom';
interface AuthArgs {
    service: string;
    secret: string;
}
export interface GatewayContext {
    headers?: any;
    viewer?: any;
    app?: string;
    gateway?: string;
}
export interface GatewayInterface {
    auth: Function;
    execute: Function;
    setHeaders: Function;
    args: AuthArgs;
}
declare class Gateway implements GatewayInterface {
    private client;
    args: AuthArgs;
    private token?;
    private expirationDate;
    constructor({ endpoint, headers, }: {
        endpoint?: any;
        headers?: {
            'x-client-name': string;
            'x-client-version': string;
        } | undefined;
    });
    auth(args: AuthArgs): Promise<{
        success: any;
        auth: any;
    }>;
    private setAuthHeaders;
    setHeaders(headers: Headers): void;
    private setExpirationDate;
    private isTokenExpired;
    private refreshAuth;
    execute(query: string, args?: null): Promise<any>;
}
export default Gateway;
//# sourceMappingURL=Gateway.d.ts.map