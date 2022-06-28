import Calculator from './Calculator';

describe('Calculator.coefFromRate()', () => {
  test('it should be equals to', () => {
    expect(
      Calculator.coefFromRate(20),
    ).toBe(1.2);
  });
});

describe('Calculator.valueFromRate()', () => {
  test('it should be equals to', () => {
    expect(
      Calculator.valueFromRate(12, 20),
    ).toBe(2.4);
  });
});

describe('Calculator.round()', () => {
  test('it should be equals to', () => {
    expect(
      Calculator.round(3.14159265, 4),
    ).toBe(3.1416);
  });

  test('it should be equals to (2)', () => {
    expect(
      Calculator.round(3.14159265, 1),
    ).toBe(3.1);
  });

  test('it should be equals to (3)', () => {
    expect(
      Calculator.round(3.14159265, 0),
    ).toBe(3);
  });

  test('it should be equals to (4)', () => {
    expect(
      Calculator.round(3.14159265),
    ).toBe(3.14);
  });
});

describe('Calculator.remove()', () => {
  test('it should remove', () => {
    expect(
      Calculator.removeRate(120, 20),
    ).toBe(100);
  });

  test('it should remove (2)', () => {
    expect(
      Calculator.removeRate(240, 20),
    ).toBe(200);
  });

  test('it should remove (3)', () => {
    expect(
      Calculator.removeRate(60, 20),
    ).toBe(50);
  });
});

describe('Calculator.addRate()', () => {
  test('it should add', () => {
    expect(
      Calculator.addRate(10, 20),
    ).toBe(12);
  });

  test('it should add (2)', () => {
    expect(
      Calculator.addRate(200, 20),
    ).toBe(240);
  });

  test('it should add (3)', () => {
    expect(
      Calculator.addRate(50, 20),
    ).toBe(60);
  });
});
