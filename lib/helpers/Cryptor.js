import crypto from 'crypto';
import e from '../security/env.js';
const ivHashes = {
    '1.0': e.CRYPTO_IV_HASH,
};
class Cryptor {
    constructor(key, version = '1.0') {
        this.version = version;
        this.resizedIV = Buffer.allocUnsafe(16);
        const iv = crypto
            .createHash('sha256')
            .update(ivHashes[version])
            .digest();
        iv.copy(this.resizedIV);
        this.key = crypto
            .createHash('sha256')
            .update(key)
            .digest();
    }
    encrypt(data) {
        const cipher = crypto.createCipheriv('aes256', this.key, this.resizedIV);
        let theCipher = cipher.update(data, 'binary', 'hex');
        theCipher += cipher.final('hex');
        return {
            data: theCipher,
            api: this.version,
        };
    }
    decrypt(data) {
        const decipher = crypto.createDecipheriv('aes256', this.key, this.resizedIV);
        let str = decipher.update(data, 'hex', 'binary');
        str += decipher.final('binary');
        return str;
    }
}
export default Cryptor;
