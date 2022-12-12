import codeGenerator from './codeGenerator';

describe('codeGenerator()', () => {
  test('it should get a code with 4 chars', () => {
    expect(codeGenerator().toString().length === 4).toBe(true);
  });
  test('it should get a code with 6 chars', () => {
    expect(codeGenerator({ length: 6 }).toString().length === 6).toBe(true);
  });
  test('it should get a number', () => {
    expect(typeof codeGenerator({ length: 6 }) === 'number').toBe(true);
  });
  test('it should get a string', () => {
    expect(typeof codeGenerator({ length: 6, alphanumeric: true }) === 'string').toBe(true);
  });
});
