import Datte from './Datte';

describe('Datte.toDate()', () => {
  test('it should get a Date', () => {
    const r = new Date();
    r.getTimezoneOffset();
    const d = new Datte();
    expect(d.toDate() instanceof Date).toBe(true);
  });
  test('it should get the utc Date', () => {
    const d = new Datte({ date: '2022-09-01' });
    expect(d.toDate()).toStrictEqual(new Date('2022-09-01T00:00:00.000Z'));
  });
  test('it should get the utc Date even with custom timezone defined', () => {
    const d = new Datte({ date: '2022-09-01', tz: 'America/New_York' });
    expect(d.toDate()).toStrictEqual(new Date('2022-09-01T00:00:00.000Z'));
  });
});

describe('Datte.toLocalDate()', () => {
  test('it should get the local Date with default timezone', () => {
    const d = new Datte({ date: '2022-09-01' });
    expect(d.toLocalDate()).toStrictEqual(new Date('2022-09-01T00:00:00.000Z'));
  });
  // TODO: Handle winter hours ?
  test('it should get the local Date timezoned', () => {
    const d = new Datte({ date: '2022-09-01', tz: 'America/New_York' });
    expect(d.toLocalDate()).toStrictEqual(new Date('2022-08-31T18:00:00.000Z'));
  });
});

describe('Datte.toString()', () => {
  test('it should get a string', () => {
    const d = new Datte();
    expect(typeof d.toString()).toBe('string');
  });
  test('it should get the string with utc timezone', () => {
    const d = new Datte({ date: '2022-09-01' });
    expect(d.toString()).toBe('2022-09-01T00:00:00.000');
  });
});

describe('Datte.toLocalString()', () => {
  test('it should get a string', () => {
    const d = new Datte();
    expect(typeof d.toLocalString()).toBe('string');
  });
  test('it should get the string with default timezone', () => {
    const d = new Datte({ date: '2022-09-01' });
    expect(d.toLocalString('YYYY-MM-DDTHH:mm:ss.SSS')).toBe('2022-09-01T00:00:00.000');
  });
  test('it should get the string timezoned', () => {
    const d = new Datte({ date: '2022-09-01', tz: 'Pacific/Auckland' });
    expect(d.toLocalString('YYYY-MM-DDTHH:mm:ss.SSS')).toBe('2022-09-01T10:00:00.000');
  });
});
