import shuffle from './shuffle';

describe('shuffle()', () => {
  test('it should get an array', () => {
    expect(Array.isArray(shuffle([1, 2, 3]))).toBe(true);
  });
  test('it should get an array with 3 items', () => {
    expect(shuffle([1, 2, 3]).length === 3).toBe(true);
  });
});
