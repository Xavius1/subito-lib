declare class Checker {
    private toThrow;
    constructor(toThrow?: boolean);
    isArray(arr: Array<any>): boolean;
    isEmpty(arr: Array<any>): boolean;
    isEquals(obj: any, value: any): boolean;
    isExists(obj: any, name?: string): boolean;
    isIn(arr: Array<any>, value: any, name?: string): boolean;
    isInstanceOf(obj: any, instance: any): boolean;
    private send;
}
export default Checker;
//# sourceMappingURL=Checker.d.ts.map