import codeGenerator from './codeGenerator';

describe('codeGenerator()', () => {
  test('it should get a code with 4 chars', () => {
    expect(codeGenerator().length === 4).toBe(true);
  });
  test('it should get a code with 6 chars', () => {
    expect(codeGenerator({ length: 6 }).length === 6).toBe(true);
  });
});
