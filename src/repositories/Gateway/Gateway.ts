import { GraphQLClient } from 'graphql-request';
import { Headers } from 'graphql-request/dist/types.dom';
import SERVICE_AUTH from './queries/SERVICE_AUTH';
import Data from '../../helpers/Data';
import e from '../../security/env';
import Thrower from '../../helpers/Thrower';

export interface AuthArgs {
  service: string,
  secret: string,
}

export interface GatewayContext {
  headers?: any,
  viewer?: any,
  app?: string,
  gateway?: string,
}

export interface GatewayInterface {
  auth: Function
  execute: Function
  setHeaders: Function
  args: AuthArgs
}

class Gateway implements GatewayInterface {
  private client: GraphQLClient;

  args: AuthArgs = { service: '', secret: '' };

  private token?: string | null;

  private expirationDate: number = 0;

  constructor({
    endpoint = e.INTERNAL_GATEWAY,
    headers = {
      'x-client-name': 'dxslib/gateway',
      'x-client-version': '1.0',
    },
  }) {
    this.client = new GraphQLClient(endpoint, { headers });
  }

  async auth(args: AuthArgs) {
    this.args = args;
    try {
      const { serviceAuth: { success, auth } } = await this.client.request(
        SERVICE_AUTH,
        args,
      );

      if (!success) {
        Thrower.unauthorized();
      }
      this.token = auth.token;
      this.setAuthHeaders();
      this.expirationDate = this.setExpirationDate(auth.expirationDate);

      return { success, auth };
    } catch (err) {
      this.expirationDate = this.setExpirationDate(new Date());
      this.token = null;
      console.log(err); // eslint-disable-line no-console

      return { success: false, auth: null };
    }
  }

  private setAuthHeaders() {
    this.client.setHeader('x-app-token', `Bearer ${this.token}`);
    this.client.setHeader('authorization', `Bearer ${this.token}`);
  }

  setHeaders(headers: Headers) {
    this.client.setHeaders(headers);
    this.setAuthHeaders();
  }

  private setExpirationDate(date: any) { // eslint-disable-line class-methods-use-this
    const data = new Data(date);
    const expDate = data.parseType('Date');
    expDate.setHours(expDate.getHours() - 1);
    return expDate.getTime();
  }

  private isTokenExpired() {
    const now = new Date();
    return (this.expirationDate <= now.getTime());
  }

  private async refreshAuth() {
    if (this.isTokenExpired()) {
      await this.auth(this.args);
    }

    return true;
  }

  async execute(query: string, args = null) {
    await this.refreshAuth();

    if (this.token) {
      try {
        return this.client.request(
          query,
          args,
        );
      } catch (err) {
        console.log(err); // eslint-disable-line no-console
      }
    } else {
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
