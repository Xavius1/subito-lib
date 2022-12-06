import Env, { EnvType } from './Env';

describe('Env', () => {
  // APP_ENV
  test('APP_ENV value should be', () => {
    expect(Env.getAll()._defaultValues.APP_ENV) // eslint-disable-line no-underscore-dangle
      .toBe('local');
  });
  test('APP_ENV allow values should be', () => {
    expect(
      Env.getAll(),
    ).toMatchObject({
      _allowedValues: {
        APP_ENV: ['local', 'current', 'develop', 'integration', 'staging', 'production'],
      },
    });
  });
  test('APP_ENV type should be', () => {
    expect(Env.getAll()._types.APP_ENV) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.ENV);
  });
  // NODE_ENV
  test('NODE_ENV value should be', () => {
    expect(Env.getAll()._defaultValues.NODE_ENV) // eslint-disable-line no-underscore-dangle
      .toBe('development');
  });
  test('NODE_ENV allow values should be', () => {
    expect(
      Env.getAll(),
    ).toMatchObject({
      _allowedValues: {
        NODE_ENV: ['development', 'test', 'production'],
      },
    });
  });
  test('NODE_ENV type should be', () => {
    expect(Env.getAll()._types.NODE_ENV) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.ENV);
  });
  // PWD
  test('PWD value should be', () => {
    expect(Env.getAll()._defaultValues.PWD) // eslint-disable-line no-underscore-dangle
      .toBe('/app');
  });
  test('PWD type should be', () => {
    expect(Env.getAll()._types.PWD) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.ENV);
  });
  // RBD
  test('RBD value should be', () => {
    expect(Env.getAll()._defaultValues.RBD) // eslint-disable-line no-underscore-dangle
      .toBe('./lib');
  });
  test('RBD type should be', () => {
    expect(Env.getAll()._types.RBD) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.ENV);
  });
  // INTERNAL_GRAPHQL_ENDPOINT
  test('INTERNAL_GRAPHQL_ENDPOINT value should be', () => {
    expect(Env.getAll()._defaultValues.INTERNAL_GRAPHQL_ENDPOINT) // eslint-disable-line no-underscore-dangle, max-len
      .toBe('http://graphql-endpoint/');
  });
  test('INTERNAL_GRAPHQL_ENDPOINT type should be', () => {
    expect(Env.getAll()._types.PWD) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.ENV);
  });
  // FORCE_DEBUG
  test('FORCE_DEBUG value should be', () => {
    expect(Env.getAll()._defaultValues.FORCE_DEBUG) // eslint-disable-line no-underscore-dangle
      .toBe(false);
  });
  test('FORCE_DEBUG type should be', () => {
    expect(Env.getAll()._types.FORCE_DEBUG) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.VAR);
  });
  test('FORCE_DEBUG parseType should be', () => {
    expect(Env.getAll()._parseTypes.FORCE_DEBUG) // eslint-disable-line no-underscore-dangle
      .toBe('Bool');
  });
  // SERVICE_AUTH_KEY
  test('SERVICE_AUTH_KEY value should be', () => {
    expect(Env.getAll()._defaultValues.SERVICE_AUTH_KEY) // eslint-disable-line no-underscore-dangle
      .toBe('dev');
  });
  test('SERVICE_AUTH_KEY type should be', () => {
    expect(Env.getAll()._types.SERVICE_AUTH_KEY) // eslint-disable-line no-underscore-dangle
      .toBe(EnvType.SECRET);
  });
  // Parse data
  test('Env.getAll() should parse data', () => {
    expect(Env.getAll([
      Env.newVar('FAKE_ENV_VAR_TEST_INT', { defaultValue: '3', parseType: 'Int' }),
    ]).FAKE_ENV_VAR_TEST_INT)
      .toBe(3);
  });
  // Env.getAll
  test('Env.getAll() should get', () => {
    expect(Env.getAll([
      Env.newVar('FAKE_ENV_VAR_TEST_ENVFILE', { defaultValue: 'test' }),
      Env.newVar('FAKE_ENV_VAR_TEST_ENVFILE2', { defaultValue: 'retest' }),
    ]))
      .toMatchObject({
        FAKE_ENV_VAR_TEST_ENVFILE: 'test',
        FAKE_ENV_VAR_TEST_ENVFILE2: 'retest',
      });
  });
  // Default secret more than 5 chars
  test('it should throw when a secret with default value more than 5 characters', () => {
    expect(() => {
      Env.getAll([
        ['FAKE_ENV_VAR_TEST_ENVFILE2', { defaultValue: 'retest', type: EnvType.SECRET }],
      ]);
    }).toThrow();
  });
  // Throw when no default
  test('it should throw when no env & no default', () => {
    expect(() => {
      Env.getAll([
        Env.newVar('FAKE_ENV_VAR_TEST', { defaultValue: undefined }),
      ]);
    }).toThrow();
  });
  // Test fallback
  test('it should return', () => {
    expect(
      Env.getAll([
        Env.newVar('FAKE_ENV_VAR_TEST', { defaultValue: 'whatever', fallback: 'NODE_ENV' }),
      ]),
    ).toMatchObject({
      _fallbacks: {
        FAKE_ENV_VAR_TEST: 'NODE_ENV',
      },
    });
  });
});

describe('Env alias methods', () => {
  // newInt
  test('Env.newInt value should be an int config', () => {
    expect(Env.newInt('TEST', { defaultValue: '116' }))
      .toStrictEqual(['TEST', { defaultValue: '116', parseType: 'Int', type: EnvType.VAR }]);
  });

  // newFloat
  test('Env.newFloat value should be a float config', () => {
    expect(Env.newFloat('TEST', { defaultValue: '11.6' }))
      .toStrictEqual(['TEST', { defaultValue: '11.6', parseType: 'Float', type: EnvType.VAR }]);
  });

  // newArray
  test('Env.newArray value should be an array config', () => {
    expect(Env.newArray('TEST', { defaultValue: 'subito,lib' }))
      .toStrictEqual(['TEST', { defaultValue: 'subito,lib', parseType: 'Array', type: EnvType.VAR }]);
  });
});
