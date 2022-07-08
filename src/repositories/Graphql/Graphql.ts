import { GraphQLClient } from 'graphql-request';
import { Headers } from 'graphql-request/dist/types.dom';
import SERVICE_AUTH from './queries/SERVICE_AUTH';
import Datte from '../../helpers/Datte';
import e from '../../security/env';
import Thrower from '../../helpers/Thrower';

/** @public */
export type { GraphQLClient } from 'graphql-request';

export interface AuthArgs {
  service: string,
  secret: string,
}

export interface GraphqlContext {
  headers?: any,
  viewer?: any,
  app?: string,
  gateway?: string,
}

export interface GraphqlInterface {
  auth: Function
  execute: Function
  setHeaders: Function
  args: AuthArgs
}

class Graphql implements GraphqlInterface {
  protected client: GraphQLClient;

  args: AuthArgs = { service: '', secret: '' };

  protected token?: string | null;

  protected expirationDate: number = 0;

  constructor({
    endpoint = e.INTERNAL_GRAPHQL_ENDPOINT,
    headers = {
      'x-client-name': 'subito/graphql',
      'x-client-version': '1.0',
    },
  }) {
    this.client = new GraphQLClient(endpoint, { headers });
  }

  async auth(args: AuthArgs) {
    this.args = args;
    try {
      const { auth: { Service: { auth: { success, auth } } } } = await this.client.request(
        SERVICE_AUTH,
        args,
      );

      if (!success) {
        Thrower.unauthorized();
      }
      this.token = auth.token;
      this.setAuthHeaders();
      this.setExpirationDate(auth.expirationDate);

      return { success, auth };
    } catch (err) {
      this.setExpirationDate(new Date());
      this.token = null;
      console.log(err); // eslint-disable-line no-console

      return { success: false, auth: null };
    }
  }

  protected setAuthHeaders() {
    this.client.setHeader('x-app-token', `Bearer ${this.token}`);
    this.client.setHeader('authorization', `Bearer ${this.token}`);
  }

  setHeaders(headers: Headers) {
    this.client.setHeaders(headers);
    this.setAuthHeaders();
  }

  protected setExpirationDate(date: Date) {
    this.expirationDate = (date.getTime() - 1800);

    return this;
  }

  protected isTokenExpired() {
    const now = new Date();
    return (this.expirationDate <= now.getTime());
  }

  protected async refreshAuth() {
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
      console.log('Graphql endpoint called but not reachable'); // eslint-disable-line no-console
      console.log(`Query: ${query}`); // eslint-disable-line no-console
      console.log(`Args: ${JSON.stringify(args)}`); // eslint-disable-line no-console
      console.log('---'); // eslint-disable-line no-console
    }

    return true;
  }
}

export default Graphql;
