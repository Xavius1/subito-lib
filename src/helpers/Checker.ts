import Thrower from './Thrower.js';

class Checker {
  private toThrow: boolean = false;

  constructor(toThrow?: boolean) {
    if (toThrow) {
      this.toThrow = toThrow;
    }
  }

  isArray(arr: Array<any>): boolean {
    if (!Array.isArray(arr)) {
      return this.send('ERR_NEED_ARRAY');
    }

    return true;
  }

  isNotEmpty(arr: any[]): boolean {
    if (!this.isArray(arr)) {
      return false;
    }

    if (arr.length === 0) {
      return this.send('ERR_EMPTY_ARRAY');
    }

    return true;
  }

  isEquals(obj: any, value: any): boolean {
    if (!this.isExists(obj) || !this.isExists(value)) {
      return false;
    }

    if (obj !== value) {
      return this.send('ERR_NEED_OBJ_MATCH_VALUE');
    }

    return true;
  }

  isExists(obj: any, name: string = ''): boolean {
    if (!obj) {
      return this.send(`ERR_NEED_NOT_NULL_OBJ ${name}`);
    }

    return true;
  }

  isIn(arr: any[], value: any, name: string = '') {
    if (!this.isArray(arr)) {
      return false;
    }

    if (!arr.includes(value)) {
      return this.send(`ERR_VALUE_NOT_IN_GROUP ${name}/${value}`);
    }

    return true;
  }

  isInstanceOf(obj: any, instance: any): boolean {
    if (!(obj instanceof instance)) {
      return this.send('ERR_NEED_SPECIFIC_INSTANCE_TYPE');
    }

    return true;
  }

  private send(message: string): boolean {
    if (this.toThrow) {
      Thrower.generic(message);
    }

    return false;
  }
}

export default Checker;
