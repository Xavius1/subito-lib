import Data from './Data';
describe('Data.parseType()', () => {
    test('it should get a float', () => {
        const data = new Data('11.42');
        expect(data.parseType('Float')).toBe(11.42);
    });
    test('it should get an integer', () => {
        const data = new Data('11');
        expect(data.parseType('Int')).toBe(11);
    });
    test('it should get a null value when entry is null', () => {
        const data = new Data(null);
        expect(data.parseType('Int')).toBeNull();
    });
    test('it should get a null value with string entry', () => {
        const data = new Data('test');
        expect(data.parseType('Int')).toBeNull();
    });
    test('it should get an array', () => {
        const data = new Data('test,test2,test3');
        expect(data.parseType('Array')).toEqual(['test', 'test2', 'test3']);
    });
    test('it should get a date', () => {
        const data = new Data('2021-02-10 19:30:00');
        expect(data.parseType('Date')).toStrictEqual(new Date('2021-02-10 19:30:00'));
    });
    test('it should get false', () => {
        const data = new Data('false');
        expect(data.parseType('Bool')).toBe(false);
    });
    test('it should get false with a string value', () => {
        const data = new Data('not a boolean');
        expect(data.parseType('Bool')).toBe(false);
    });
    test('it should get true', () => {
        const data = new Data('true');
        expect(data.parseType('Bool')).toBe(true);
    });
});
describe('Data.ucfirst()', () => {
    test('it should ucfirst an uppercase value', () => {
        const data = new Data('TEST');
        expect(data.ucfirst()).toBe('Test');
    });
    test('it should ucfirst a lowercase value', () => {
        const data = new Data('test');
        expect(data.ucfirst()).toBe('Test');
    });
});
describe('Data.NaNtoNull()', () => {
    test('it should return a null value', () => {
        const data = new Data(NaN);
        expect(data.NaNtoNull()).toBeNull();
    });
});
