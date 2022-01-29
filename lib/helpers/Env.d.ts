import type { ParseType } from './Data.js';
declare type EnvOptions = {
    allow?: any[];
    type?: ParseType;
    defaultValue?: any;
    scope?: 'all' | string[];
};
declare type EnvList = [string, EnvOptions][];
declare class Env {
    private static get;
    static getAll(list: EnvList): any;
}
export default Env;
//# sourceMappingURL=Env.d.ts.map