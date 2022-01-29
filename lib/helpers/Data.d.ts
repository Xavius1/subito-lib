export declare type ParseType = 'Array' | 'Bool' | 'Date' | 'Float' | 'Int' | 'secret' | undefined;
declare class Data {
    private value;
    constructor(value: any);
    parseType(type: ParseType): any;
    ucfirst(): any;
    NaNtoNull(): any;
}
export default Data;
//# sourceMappingURL=Data.d.ts.map