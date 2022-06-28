import Env from './Env';

describe('helpers/Env', () => {
  // APP_ENV
  test('APP_ENV value should be', () => {
    expect(Env.getAll([['APP_ENV']])) // eslint-disable-line no-underscore-dangle
      .toMatchObject({ APP_ENV: 'local' });
  });
  // Env.getAll
  test('Env.getAll() should get', () => {
    expect(Env.getAll([
      ['FAKE_ENV_VAR_TEST_ENVFILE', { defaultValue: 'test' }],
      ['FAKE_ENV_VAR_TEST_ENVFILE2', { defaultValue: 'retest' }],
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
});
