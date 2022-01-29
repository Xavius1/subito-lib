import { GraphQLClient } from 'graphql-request';
import SERVICE_AUTH from './queries/SERVICE_AUTH.js';
import Data from '../../helpers/Data.js';
import e from '../../security/env.js';
import Thrower from '../../helpers/Thrower.js';
class Gateway {
    constructor({ endpoint = e.INTERNAL_GATEWAY, headers = {
        'x-client-name': 'dxslib/gateway',
        'x-client-version': '1.0',
    }, }) {
        this.args = { service: '', secret: '' };
        this.expirationDate = 0;
        this.client = new GraphQLClient(endpoint, { headers });
    }
    async auth(args) {
        this.args = args;
        try {
            const { serviceAuth: { success, auth } } = await this.client.request(SERVICE_AUTH, args);
            if (!success) {
                Thrower.unauthorized();
            }
            this.token = auth.token;
            this.setAuthHeaders();
            this.expirationDate = this.setExpirationDate(auth.expirationDate);
            return { success, auth };
        }
        catch (err) {
            this.expirationDate = this.setExpirationDate(new Date());
            this.token = null;
            console.log(err); // eslint-disable-line no-console
            return { success: false, auth: null };
        }
    }
    setAuthHeaders() {
        this.client.setHeader('x-app-token', `Bearer ${this.token}`);
        this.client.setHeader('authorization', `Bearer ${this.token}`);
    }
    setHeaders(headers) {
        this.client.setHeaders(headers);
        this.setAuthHeaders();
    }
    setExpirationDate(date) {
        const data = new Data(date);
        const expDate = data.parseType('Date');
        expDate.setHours(expDate.getHours() - 1);
        return expDate.getTime();
    }
    isTokenExpired() {
        const now = new Date();
        return (this.expirationDate <= now.getTime());
    }
    async refreshAuth() {
        if (this.isTokenExpired()) {
            await this.auth(this.args);
        }
        return true;
    }
    async execute(query, args = null) {
        await this.refreshAuth();
        if (this.token) {
            try {
                return this.client.request(query, args);
            }
            catch (err) {
                console.log(err); // eslint-disable-line no-console
            }
        }
        else {
            console.log('---'); // eslint-disable-line no-console
            console.log('Gateway called but not reachable'); // eslint-disable-line no-console
            console.log(`Query: ${query}`); // eslint-disable-line no-console
            console.log(`Args: ${JSON.stringify(args)}`); // eslint-disable-line no-console
            console.log('---'); // eslint-disable-line no-console
        }
        return true;
    }
}
export default Gateway;
