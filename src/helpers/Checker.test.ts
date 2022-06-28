import Checker from './Checker';

describe('helpers/Checker', () => {
  const checker = new Checker(true);
  // isArray
  test('isArray should return true', () => {
    expect(checker.isArray(['value'])) // eslint-disable-line no-underscore-dangle
      .toBe(true);
  });
});
