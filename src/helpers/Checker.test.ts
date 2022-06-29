import Checker from './Checker';

describe('helpers/Checker', () => {
  const checker = new Checker(true);
  const checker2 = new Checker();

  class FakeClass {}
  // isArray
  test('isArray should return true', () => {
    expect(checker.isArray(['value']))
      .toBe(true);
  });
  test('isArray should throw', () => {
    expect(() => {
      // @ts-ignore
      checker.isArray('value');
    }).toThrow();
  });
  test('isArray should return false', () => {
    expect(
      // @ts-ignore
      checker2.isArray('value'),
    ).toBe(false);
  });

  // isNotEmpty
  test('isNotEmpty should return true', () => {
    expect(checker.isNotEmpty(['value']))
      .toBe(true);
  });
  test('isNotEmpty should throw', () => {
    expect(() => {
      checker.isNotEmpty([]);
    }).toThrow();
  });
  test('isNotEmpty should return false', () => {
    expect(checker2.isNotEmpty([])).toBe(false);
  });
  test('isNotEmpty should throw (2)', () => {
    expect(() => {
      // @ts-ignore
      checker.isNotEmpty('value');
    }).toThrow();
  });
  test('isNotEmpty should return false (2)', () => {
    expect(
      // @ts-ignore
      checker2.isNotEmpty('value'),
    ).toBe(false);
  });

  // isEquals
  test('it should throw when it\'s not equal', () => {
    expect(() => {
      checker.isEquals('Xavius', 'CTO');
    }).toThrow();
  });
  test('it should return false', () => {
    expect(checker2.isEquals('Xavius', 'CTO')).toBe(false);
  });
  test('it should throw when it\'s not equal (2)', () => {
    expect(() => {
      checker.isEquals('1', 1);
    }).toThrow();
  });
  test('it should return false (2)', () => {
    expect(checker2.isEquals('1', 1)).toBe(false);
  });
  test('it should throw when it\'s not equal (3)', () => {
    expect(() => {
      // @ts-ignore
      checker.isEquals('1');
    }).toThrow();
  });
  test('it should return false (3)', () => {
    // @ts-ignore
    expect(checker2.isEquals('1')).toBe(false);
  });
  test('it should throw when it\'s not equal (4)', () => {
    expect(() => {
      checker.isEquals(undefined, '1');
    }).toThrow();
  });
  test('it should return false (4)', () => {
    // @ts-ignore
    expect(checker2.isEquals(undefined, '1')).toBe(false);
  });
  test('it should return true', () => {
    expect(checker.isEquals('Xavius', 'Xavius')).toBeTruthy();
  });
  test('it should return true (2)', () => {
    expect(checker.isEquals(1, 1)).toBeTruthy();
  });

  // isExists
  test('isExists should throw', () => {
    expect(() => {
      // @ts-ignore
      checker.isExists();
    }).toThrow();
  });
  test('isExists should return false', () => {
    // @ts-ignore
    expect(checker2.isExists()).toBe(false);
  });
  test('isExists should return true', () => {
    expect(checker.isExists('Xavius')).toBeTruthy();
  });

  // isIn
  test('isIn should throw', () => {
    expect(() => {
      checker.isIn(['Xavius', 'CEO', 'CTO'], 'Lead dev');
    }).toThrow();
  });
  test('isIn should return false', () => {
    expect(checker2.isIn(['Xavius', 'CEO', 'CTO'], 'Lead dev')).toBe(false);
  });
  test('isIn should throw (2)', () => {
    expect(() => {
      // @ts-ignore
      checker.isIn('Xavius', 'Lead dev');
    }).toThrow();
  });
  test('isIn should return false (2)', () => {
    // @ts-ignore
    expect(checker2.isIn('Xavius', 'Lead dev')).toBe(false);
  });
  test('isIn should return true', () => {
    expect(checker.isIn(['Xavius', 'CEO', 'CTO'], 'CEO')).toBeTruthy();
  });

  // isInstanceOf
  test('isInstanceOf should throw', () => {
    expect(() => {
      checker.isInstanceOf(checker, FakeClass);
    }).toThrow();
  });
  test('isInstanceOf should return false', () => {
    expect(checker2.isInstanceOf(checker, FakeClass)).toBe(false);
  });
  test('isInstanceOf should throw (2)', () => {
    expect(() => {
      // @ts-ignore
      checker.isInstanceOf(checker, FakeClass);
    }).toThrow();
  });
  test('isInstanceOf should return false (2)', () => {
    // @ts-ignore
    expect(checker2.isInstanceOf(checker, FakeClass)).toBe(false);
  });
  test('isInstanceOf should return true', () => {
    expect(checker.isInstanceOf(checker, Checker)).toBeTruthy();
  });
});
