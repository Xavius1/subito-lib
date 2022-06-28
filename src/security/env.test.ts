import e from './env';

describe('env.js', () => {
  // INTERNAL_GATEWAY
  test('INTERNAL_GATEWAY default value should be', () => {
    expect(e._defaultValues.INTERNAL_GATEWAY) // eslint-disable-line no-underscore-dangle
      .toBe('http://internal-gateway/');
  });
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
  // CRYPTO_IV_HASH
  test('CRYPTO_IV_HASH type should be', () => {
    expect(e._types.CRYPTO_IV_HASH) // eslint-disable-line no-underscore-dangle
      .toBe('secret');
  });
  // JWT_KEY
  test('JWT_KEY type should be', () => {
    expect(e._types.JWT_KEY) // eslint-disable-line no-underscore-dangle
      .toBe('secret');
  });
});
