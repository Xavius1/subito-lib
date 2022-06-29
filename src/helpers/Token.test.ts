import Token from './Token';

describe('Token.sign()', () => {
  test('it should get a token', () => {
    expect(typeof Token.sign(
      { user: 'fake' },
      'test',
      99999,
    )).toBe('string');
  });

  test('it should get a token (2)', () => {
    expect(typeof Token.sign(
      { user: 'fake', roles: ['ADMIN_DEV'] },
      'test',
      99999,
    )).toBe('string');
  });
});

describe('Token.read()', () => {
  const token = Token.sign(
    { user: 'fake' },
    'test',
    7,
  );

  test('it should get a token', () => {
    expect(Token.read(token)).toMatchObject({ user: 'fake' });
  });

  test('it should return null', () => {
    expect(Token.read('fake-token')).toBeNull();
  });
});
