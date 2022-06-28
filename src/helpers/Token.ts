import jwt from 'jsonwebtoken';
import e from '../security/env';

interface Data {
  [key: string]: any
}

class Token {
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

  static read(token: string, key: string = e.JWT_KEY) {
    try {
      return jwt.verify(token.replace(/^Bearer\s+/, ''), key);
    } catch (err: any) {
      return null;
    }
  }
}

export default Token;
