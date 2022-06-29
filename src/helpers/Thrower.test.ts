import Thrower from './Thrower';

describe('Thrower.generic()', () => {
  test('it should throw', () => {
    expect(() => {
      Thrower.generic('Xavius is Lead dev');
    }).toThrow();
  });
});

describe('Thrower.forbidden()', () => {
  test('it should throw', () => {
    expect(() => {
      Thrower.forbidden();
    }).toThrow();
  });
});

describe('Thrower.unauthorized()', () => {
  test('it should throw', () => {
    expect(() => {
      Thrower.unauthorized();
    }).toThrow();
  });
});
