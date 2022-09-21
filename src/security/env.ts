import Env from '../helpers/Env.js';

/** @internal */
const env = Env.getAll([
  Env.newSecret('CRYPTO_IV_HASH'),
  Env.newSecret('JWT_KEY'),
  Env.newSecret('SERVICE_AUTH_KEY'),
  Env.newEnv('INTERNAL_GRAPHQL_ENDPOINT', { defaultValue: 'http://endpoint' }),
  Env.newInt('TOKEN_MAX_VALIDITY', { defaultValue: 7 }),
  Env.newInt('TOKEN_VALIDITY_DEV', { defaultValue: 1 }),
  Env.newVar('DEFAULT_TIMEZONE', { defaultValue: 'Europe/Paris' }),
  Env.newVar('DEFAULT_LOCALE', { defaultValue: 'fr' }),
  Env.newVar('DEFAULT_DATE_FORMAT', { defaultValue: 'YYYY-MM-DDTHH:mm:ss.SSS' }),
]);

export default env;
