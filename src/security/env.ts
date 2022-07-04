import Env from '../helpers/Env';

const env: any = Env.getAll([
  Env.newSecret('CRYPTO_IV_HASH'),
  Env.newSecret('JWT_KEY'),
  Env.newEnv('INTERNAL_GATEWAY', { defaultValue: 'http://internal-gateway/' }),
  Env.newVar('TOKEN_MAX_VALIDITY', { defaultValue: 7 }),
  Env.newVar('TOKEN_VALIDITY_DEV', { defaultValue: 1 }),
  Env.newVar('DEFAULT_TIMEZONE', { defaultValue: 'Europe/Paris' }),
  Env.newVar('DEFAULT_LOCALE', { defaultValue: 'fr' }),
  Env.newVar('DEFAULT_DATE_FORMAT', { defaultValue: 'YYYY-MM-DDTHH:mm:ss.SSS' }),
]);

export default env;
