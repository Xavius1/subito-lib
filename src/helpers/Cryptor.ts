import crypto from 'crypto';
import e from '../security/env.js';

interface IvHashes {
  [key: string]: string
}

const ivHashes: IvHashes = {
  '1.0': e.CRYPTO_IV_HASH,
};

/**
 * The data object to encrypt
 * @public
 */
export type EncryptData = {
  data: string,
  api: string
}

/**
 * Handles data encryption into your app
 * @public
 */
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

  /**
   * Encrypt a data
   * @param data - The data to encrypt
   * @returns
   *
   * @public
   */
  encrypt(data: any): EncryptData {
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, this.resizedIV);
    let theCipher = cipher.update(data, 'binary', 'hex');
    theCipher += cipher.final('hex');
    return {
      data: `${theCipher}_${cipher.getAuthTag().toString('hex')}_${this.resizedIV.toString('hex')}`,
      api: this.version,
    };
  }

  /**
   * Decrypt an encrypted data
   * @param data - The encrypted data
   * @returns
   *
   * @public
   */
  decrypt(data: string): string {
    const [str, tag, iv] = data.split('_');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let res = decipher.update(str, 'hex', 'binary');
    res += decipher.final('binary');

    return res;
  }
}

export default Cryptor;
