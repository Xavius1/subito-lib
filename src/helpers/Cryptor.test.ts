import Cryptor from './Cryptor';

describe('Cryptor.encrypt()', () => {
  const cryptor = new Cryptor('test', '1.0');

  test('it should encrypt', () => {
    expect(
      cryptor.encrypt('value'),
    ).toStrictEqual({ data: '2524ba7b29_bd99eed8b167863cf792b2adc697aa75_ef260e9aa3c673af240d17a266048036', api: '1.0' });
  });
});

describe('Cryptor.decrypt()', () => {
  const cryptor = new Cryptor('test', '1.0');

  test('it should decrypt', () => {
    expect(
      cryptor.decrypt('2524ba7b29_bd99eed8b167863cf792b2adc697aa75_ef260e9aa3c673af240d17a266048036'),
    ).toBe('value');
  });

  const cryptor2 = new Cryptor('test');

  test('it should decrypt (2)', () => {
    expect(
      cryptor2.decrypt('2524ba7b29_bd99eed8b167863cf792b2adc697aa75_ef260e9aa3c673af240d17a266048036'),
    ).toBe('value');
  });
});
