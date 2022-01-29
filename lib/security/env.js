import Env from '../helpers/Env.js';
const env = Env.getAll([
    ['CRYPTO_IV_HASH', { defaultValue: 'dev', type: 'secret' }],
    ['INTERNAL_GATEWAY', { defaultValue: 'http://internal-gateway/' }],
    ['JWT_KEY', { defaultValue: 'dev', type: 'secret' }],
    ['TOKEN_MAX_VALIDITY', { defaultValue: 7 }],
    ['TOKEN_VALIDITY_DEV', { defaultValue: 1 }],
]);
export default env;
