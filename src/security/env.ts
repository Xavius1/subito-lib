import Env from '../helpers/Env.js';

const env: any = Env.getAll([
  Env.newSecret('CRYPTO_IV_HASH'),
  Env.newSecret('JWT_KEY'),
  ['INTERNAL_GATEWAY', { defaultValue: 'http://internal-gateway/' }],
  ['TOKEN_MAX_VALIDITY', { defaultValue: 7 }],
  ['TOKEN_VALIDITY_DEV', { defaultValue: 1 }],
]);

export default env;
