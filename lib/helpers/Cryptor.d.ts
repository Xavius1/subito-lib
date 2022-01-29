declare type EncryptData = {
    data: string;
    api: string;
};
declare class Cryptor {
    private version;
    private key;
    private resizedIV;
    constructor(key: string, version?: string);
    encrypt(data: any): EncryptData;
    decrypt(data: string): string;
}
export default Cryptor;
//# sourceMappingURL=Cryptor.d.ts.map