import Thrower from './Thrower.js';

class Checker {
  private toThrow: boolean = false;

  constructor(toThrow?: boolean) {
    if (toThrow) {
      this.toThrow = toThrow;
    }
  }

  isArray(arr: Array<any>): boolean {
    if (!this.isArray(arr)) {
      this.send('ERR_NEED_ARRAY');
    }

    return true;
  }

  isEmpty(arr: Array<any>): boolean {
    this.isArray(arr);
    if (arr.length === 0) {
      this.send('ERR_EMPTY_ARRAY');
    }

    return true;
  }

  isEquals(obj: any, value: any): boolean {
    this.isExists(obj);
    this.isExists(value);
    if (obj !== value) {
      this.send('ERR_NEED_OBJ_MATCH_VALUE');
    }

    return true;
  }

  isExists(obj: any, name: string = ''): boolean {
    if (!obj) {
      this.send(`ERR_NEED_NOT_NULL_OBJ ${name}`);
    }

    return true;
  }

  isIn(arr: Array<any>, value: any, name: string = '') {
    this.isArray(arr);
    if (!arr.includes(value)) {
      this.send(`ERR_VALUE_NOT_IN_GROUP ${name}/${value}`);
    }

    return true;
  }

  isInstanceOf(obj: any, instance: any): boolean {
    if (!(obj instanceof instance)) {
      this.send('ERR_NEED_SPECIFIC_INSTANCE_TYPE');
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
