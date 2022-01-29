import LOG_ACCESS from './queries/LOG_ACCESS.js';
import LOG_INFO from './queries/LOG_INFO.js';
import LOG_ERROR from './queries/LOG_ERROR.js';
import LOG_WARNING from './queries/LOG_WARNING.js';
const getTraceStack = function getTraceStack() {
    return Error().stack?.replace(/^Error\n/, '');
};
export class Logger {
    constructor() {
        this.context = {};
    }
    setGateway(gateway) {
        this.gateway = gateway;
        this.trigger = this.gateway?.args?.service || 'unknown';
    }
    setContext(context) {
        this.context = context;
        return this;
    }
    async save(query, code, message, input, { headers, viewer, app, gateway, } = {}) {
        try {
            if (headers) {
                this.gateway?.setHeaders(headers);
            }
            return this.gateway?.execute(query, {
                code,
                message,
                input,
                trigger: this.trigger,
                trace: getTraceStack(),
                context: {
                    headers, viewer, app, gateway,
                },
            });
        }
        catch (e) {
            console.log('[INFO] Gateway unavailable at this time.'); // eslint-disable-line no-console
            console.log(`[${code}] ${message}`); // eslint-disable-line no-console
        }
        return null;
    }
    async newInfo(message, context = this.context) {
        return this.save(LOG_INFO, null, message, null, context);
    }
    async newError(code, message, input, context = this.context) {
        return this.save(LOG_ERROR, code, message, input, context);
    }
    async newWarning(code, message, input, context = this.context) {
        return this.save(LOG_WARNING, code, message, input, context);
    }
    async newAccess(code, message, input, context = this.context) {
        return this.save(LOG_ACCESS, code, `${this.trigger}>${message}`, input, context);
    }
}
export default new Logger();
