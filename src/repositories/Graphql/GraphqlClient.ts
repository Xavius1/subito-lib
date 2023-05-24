import { GraphQLClient } from 'graphql-request';
import { Headers } from 'graphql-request/dist/types.dom';
import SERVICE_AUTH from './queries/SERVICE_AUTH.js';
import e from '../../security/env.js';
import Thrower from '../../helpers/Thrower.js';

/** @public */
export interface AuthInput {
  service: string,
  secret: string,
}

/** @public */
export interface GraphqlContext {
  headers?: any,
  viewer?: any,
  app?: string,
  gateway?: string,
}

/** @public */
export interface IGraphqlClient {
  auth: Function
  execute: Function
  setCustomHeaders: Function
  setViewerToken: Function
  getClientName: Function
}

/** @public */
export type GraphqlClientProps = {
  endpoint?: string
  headers?: {
    'x-client-name': string
    'x-client-version': string
  }
  authQuery?: string
}

/**
 * Connect to a GraphQL endpoint
 *
 * @public
 */
class GraphqlClient implements IGraphqlClient {
  /**
   * The graphql client
   * @public
   */
  protected client: GraphQLClient;

  /**
   * Auth query
   * @public
   */
  protected authQuery: string;

  /**
   * The credentials to auth the client
   * @public
   */
  protected input: AuthInput = { service: '', secret: '' };

  /**
   * The auth token
   * @public
   */
  protected token?: string | null;

  /**
   * The auth viewer token
   * @public
   */
  protected viewerToken?: string | null;

  /**
   * The token expiration date
   * @public
   */
  protected expirationDate: number = 0;

  constructor({
    endpoint = e.INTERNAL_GRAPHQL_ENDPOINT,
    headers = {
      'x-client-name': 'subito/graphql',
      'x-client-version': '1.0',
    },
    authQuery,
  }: GraphqlClientProps) {
    this.authQuery = authQuery || SERVICE_AUTH;
    this.client = new GraphQLClient(endpoint, { headers });
  }

  /**
   * Get an auth token
   *
   * @param input - Your credentials
   * @returns
   *
   * @public
   */
  async auth(input: AuthInput) {
    this.input = input;
    try {
      const { authQuery, client } = this;
      const res = await client.request(
        authQuery,
        input,
      );

      const data = res?.auth?.Service?.auth || null;

      if (!data) {
        return res;
      }

      const { success, auth } = data;

      if (!data.success) {
        Thrower.unauthorized();
      }
      this.token = auth.token;

      let d = auth.expirationDate;
      if (typeof auth.expirationDate === 'string') {
        d = new Date(auth.expirationDate);
      }
      this.setExpirationDate(d);
      this.setAuthHeaders();
      return { success, auth };
    } catch (err) {
      this
        .setExpirationDate(new Date())
        .token = null;

      console.log(err); // eslint-disable-line no-console

      return { success: false, auth: null };
    }
  }

  /**
   * Get the client name
   *
   * @returns
   *
   * @public
   */
  getClientName(): string {
    return this.input.service;
  }

  /**
   * Set auth headers
   *
   * @returns
   *
   * @public
   */
  protected setAuthHeaders(): GraphqlClient {
    this.client.setHeader('x-app-token', `Bearer ${this.token}`);

    if (this.viewerToken) {
      this.client.setHeader('authorization', `Bearer ${this.viewerToken}`);
    }

    return this;
  }

  /**
   * Set viewer token
   *
   * @param token - The viewer token to add
   * @returns
   *
   * @public
   */
  setViewerToken(token: string): GraphqlClient {
    this.viewerToken = token;
    this.setAuthHeaders();

    return this;
  }

  /**
   * Set custom headers
   *
   * @param headers - Headers to add
   * @returns
   *
   * @public
   */
  setCustomHeaders(headers: Headers): GraphqlClient {
    this.client.setHeaders(headers);
    this.setAuthHeaders();

    return this;
  }

  /**
   * Set expiration date
   *
   * @param date - Expiration date
   * @returns
   *
   * @public
   */
  protected setExpirationDate(date: Date): GraphqlClient {
    this
      .setAuthHeaders()
      .expirationDate = (date.getTime() - 1800);

    return this;
  }

  /**
   * Check if the token has expired
   *
   * @returns
   *
   * @public
   */
  protected isTokenExpired(): boolean {
    const now = new Date();
    return (this.expirationDate <= now.getTime());
  }

  /**
   * Get a new auth token
   *
   * @returns
   *
   * @public
   */
  protected async refreshAuth(): Promise<true> {
    if (this.isTokenExpired()) {
      await this.auth(this.input);
    }

    return true;
  }

  /**
   * Execute a query through the graphql endpoint
   * @param query - Your query
   * @param input - Input needed by your query
   * @returns
   *
   * @public
   */
  async execute(query: string, input = null) {
    await this.refreshAuth();

    if (this.token) {
      try {
        return this.client.request(
          query,
          input,
        );
      } catch (err) {
        console.log(err); // eslint-disable-line no-console
      }
    } else {
      console.log('---'); // eslint-disable-line no-console
      console.log('Graphql endpoint called but not reachable'); // eslint-disable-line no-console
      console.log(`Query: ${query}`); // eslint-disable-line no-console
      console.log(`Args: ${JSON.stringify(input)}`); // eslint-disable-line no-console
      console.log('---'); // eslint-disable-line no-console
    }

    return true;
  }
}

export default GraphqlClient;
