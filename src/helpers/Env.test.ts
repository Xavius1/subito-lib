import Env, { EnvType } from './Env';

describe('helpers/Env', () => {
  // APP_ENV
  test('APP_ENV value should be', () => {
    expect(Env.getAll([['APP_ENV']]))
      .toMatchObject({ APP_ENV: 'local' });
  });
  // PWD
  test('PWD value should be', () => {
    expect(Env.getAll([['PWD']])._defaultValues.PWD) // eslint-disable-line no-underscore-dangle
      .toBe('/app');
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
        _defaultValues: {
          FAKE_ENV_VAR_TEST_ENVFILE: 'test',
          FAKE_ENV_VAR_TEST_ENVFILE2: 'retest',
        },
        _recipe: [
          ['FAKE_ENV_VAR_TEST_ENVFILE', { defaultValue: 'test' }],
          ['FAKE_ENV_VAR_TEST_ENVFILE2', { defaultValue: 'retest' }],
        ],
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
  // NODE_ENV config
  test('it should return NODE_ENV', () => {
    expect(
      Env.getAll([
        ['NODE_ENV'],
      ]),
    ).toMatchObject({
      _allowedValues: {
        NODE_ENV: ['development', 'test', 'production'],
      },
    });
  });
});
