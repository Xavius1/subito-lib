import { EnvType } from '../helpers/Env';
import e from './env';

describe('env.js', () => {
  // TOKEN_MAX_VALIDITY
  test('TOKEN_MAX_VALIDITY default value should be', () => {
    expect(e._defaultValues.TOKEN_MAX_VALIDITY) // eslint-disable-line no-underscore-dangle
      .toBe(7);
  });
  // TOKEN_VALIDITY_DEV
  test('TOKEN_VALIDITY_DEV default value should be', () => {
    expect(e._defaultValues.TOKEN_VALIDITY_DEV) // eslint-disable-line no-underscore-dangle
      .toBe(1);
  });
  // DEFAULT_TIMEZONE
  test('DEFAULT_TIMEZONE default value should be', () => {
    expect(e._defaultValues.DEFAULT_TIMEZONE) // eslint-disable-line no-underscore-dangle
      .toBe('Europe/Paris');
  });
  // DEFAULT_LOCALE
  test('DEFAULT_LOCALE default value should be', () => {
    expect(e._defaultValues.DEFAULT_LOCALE) // eslint-disable-line no-underscore-dangle
      .toBe('fr');
  });
  // DEFAULT_DATE_FORMAT
  test('DEFAULT_DATE_FORMAT default value should be', () => {
    expect(e._defaultValues.DEFAULT_DATE_FORMAT) // eslint-disable-line no-underscore-dangle
      .toBe('YYYY-MM-DDTHH:mm:ss.SSS');
  });
  // INTERNAL_GRAPHQL_ENDPOINT
  test('INTERNAL_GRAPHQL_ENDPOINT default value should be', () => {
    expect(e._defaultValues.INTERNAL_GRAPHQL_ENDPOINT) // eslint-disable-line no-underscore-dangle
      .toBe('http://endpoint');
  });
  // CRYPTO_IV_HASH
  test('CRYPTO_IV_HASH type should be', () => {
    expect(e._types.CRYPTO_IV_HASH) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.SECRET);
  });
  // JWT_KEY
  test('JWT_KEY type should be', () => {
    expect(e._types.JWT_KEY) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.SECRET);
  });
  // SERVICE_AUTH_KEY
  test('SERVICE_AUTH_KEY type should be', () => {
    expect(e._types.SERVICE_AUTH_KEY) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.SECRET);
  });
});
