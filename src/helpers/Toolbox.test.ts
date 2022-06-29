import Toolbox from './Toolbox';

describe('Toolbox.intersection()', () => {
  test('it should get an array intersection', () => {
    expect(
      Toolbox.intersection(['Xavius', 'CEO'], ['Xavius', 'CTO']),
    ).toStrictEqual(['Xavius']);
  });
  test('it should get an array intersection (2)', () => {
    expect(
      Toolbox.intersection(['Xavius', 'CEO'], ['Xavius', 'CTO', 'CEO']),
    ).toStrictEqual(['Xavius', 'CEO']);
  });
  test('it should get an array intersection (3)', () => {
    expect(
      Toolbox.intersection(['Xavius', 'CEO', 'CTO'], ['Xavius', 'CEO']),
    ).toStrictEqual(['Xavius', 'CEO']);
  });
  test('it should throw', () => {
    expect(() => {
      // @ts-ignore
      Toolbox.intersection(['Xavius', 'CEO'], null);
    }).toThrow();
  });
  test('it should throw (2)', () => {
    expect(() => {
      // @ts-ignore
      Toolbox.intersection(undefined, ['Xavius', 'CTO']);
    }).toThrow();
  });
});

describe('Toolbox.replaceJsonKeyPart()', () => {
  test('it should get an object', () => {
    expect(
      Toolbox.replaceJsonKeyPart(
        { user: 'Xavius' },
        'user',
        'admin',
      ),
    ).toStrictEqual({ admin: 'Xavius' });
  });

  test('it should get an array of object', () => {
    expect(
      Toolbox.replaceJsonKeyPart(
        [{ user: 'Xavius' }, { user: 'Adee' }],
        'user',
        'admin',
      ),
    ).toStrictEqual([{ admin: 'Xavius' }, { admin: 'Adee' }]);
  });
});
