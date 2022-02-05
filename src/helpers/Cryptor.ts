import crypto from 'crypto';
import e from '../security/env.js';

interface IvHashes {
  [key: string]: string
}

const ivHashes: IvHashes = {
  '1.0': e.CRYPTO_IV_HASH,
};

export type EncryptData = {
  data: string,
  api: string
}

class Cryptor {
  private version: string;

  private key: Buffer;

  private resizedIV: Buffer;

  constructor(key: string, version: string = '1.0') {
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

  encrypt(data: any): EncryptData {
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, this.resizedIV);
    let theCipher = cipher.update(data, 'binary', 'hex');
    theCipher += cipher.final('hex');
    return {
      data: theCipher,
      api: this.version,
    };
  }

  decrypt(data: string): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, this.resizedIV);
    let str = decipher.update(data, 'hex', 'binary');
    str += decipher.final('binary');
    return str;
  }
}

export default Cryptor;
