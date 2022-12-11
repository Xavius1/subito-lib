import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import e from '../security/env.js';

/** @public */
export interface Data {
  [key: string]: any
}

/** @public */
export type ReadOptions = {
  key?: string
  endpoint?: string
}

/**
 * Handle tokens auth
 *
 * @public
 */
class Token {
  /**
   * Sign a new token
   *
   * @remarks
   * Security best practice: Create a token that contains the name of the endpoint
   * use to generate it.
   * This way, when you read it, you can verify the endpoint use to execute requests match the one
   * use to created the token.
   * For example, a token created through the internal endpoint should not be used through
   * the client endpoint and vice versa.
   *
   * @param data - Content of your token
   * @param subject - Subject
   * @param expiresIn - Expressed in seconds or a string describing a time span zeit/ms. {@link https://github.com/vercel/ms}
   * @param key - Secret use to encoded the token
   * @returns
   *
   * @public
   */
  static sign(data: Data, subject: string, expiresIn: number, key: string = e.JWT_KEY) {
    const roles = data.roles ?? [];
    // For security reason, we do not accept to create a ADMIN_DEV
    // token valid more than TOKEN_VALIDITY_DEV day(s)
    let acceptedExpiresIn = (roles.includes('ADMIN_DEV')) ? e.TOKEN_VALIDITY_DEV : expiresIn;
    // And we don't accept to create a token valid more than TOKEN_MAX_VALIDITY day(s) at all
    if (acceptedExpiresIn > e.TOKEN_MAX_VALIDITY) {
      acceptedExpiresIn = e.TOKEN_MAX_VALIDITY;
    }

    return jwt.sign(
      data,
      key,
      { algorithm: 'HS256', subject, expiresIn: `${acceptedExpiresIn}d` },
    );
  }

  /**
   * Decode a token
   *
   * @param token - The token to decode
   * @param options - Some options use to decode the token
   * @returns
   *
   * @public
   */
  static read(token: string, { key = e.JWT_KEY, endpoint }: ReadOptions = {}) {
    try {
      const simpleToken = token.replace(/^Bearer\s+/, '');
      const data = <JwtPayload>jwt.verify(simpleToken, key);
      /**
       * For security reason, your token should always have the endpoint that created it.
       * Then your token could only be use on that endpoint
       */
      if (endpoint && data.endpoint !== endpoint) {
        return null;
      }

      return { ...data, token };
    } catch (err: any) {
      return null;
    }
  }
}

export default Token;
