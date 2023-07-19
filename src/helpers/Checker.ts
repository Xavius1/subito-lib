import Thrower from './Thrower.js';

/**
 * Some helpers to check your data
 * @public
 */
class Checker {
  protected toThrow: boolean = false;

  constructor(toThrow?: boolean) {
    if (toThrow) {
      this.toThrow = toThrow;
    }
  }

  /**
   * Verify if the data is an array, then throw if not
   *
   * @param arr - The array to verify
   * @returns
   *
   * @public
   */
  isArray(arr: Array<any>): boolean {
    if (!Array.isArray(arr)) {
      return this.send('ERR_NEED_ARRAY');
    }

    return true;
  }

  /**
   * Verify if an array is not empty, then throw if it is
   * @param arr - The array to verify
   * @returns
   *
   * @public
   */
  isNotEmpty(arr: any[]): boolean {
    if (!this.isArray(arr)) {
      return false;
    }

    if (arr.length === 0) {
      return this.send('ERR_EMPTY_ARRAY');
    }

    return true;
  }

  /**
   * Verify if 2 objects are equals, then throw if not
   *
   * @param obj - The first object to compare
   * @param value - The second one
   * @returns
   *
   * @public
   */
  isEquals(obj: any, value: any): boolean {
    if (!this.isExists(obj) || !this.isExists(value)) {
      return false;
    }

    if (obj !== value) {
      return this.send('ERR_NEED_OBJ_MATCH_VALUE');
    }

    return true;
  }

  /**
   * Check if the given value/object is **NOT** `null` nor `undefined`, then throw if not
   *
   * @param obj - The first object to compare.
   * @param name - A name to include in the error message.
   * @throws Error - If the given value is either `null` or `undefined`
   * @returns
   *
   * @public
   */
  isDefined(obj: any, name: string = ''): boolean {
    if (obj === undefined || obj === null) {
      return this.send(`ERR_NEED_DEFINED_OBJ ${name})`);
    }

    return true;
  }

  /**
   * Verify if an object is defined, then throw if not
   *
   * @param obj - The object to verify
   * @param name - Use to trace the name of the object in the error
   * @returns
   *
   * @public
   */
  isExists(obj: any, name: string = ''): boolean {
    if (!obj) {
      return this.send(`ERR_NEED_NOT_NULL_OBJ ${name}`);
    }

    return true;
  }

  /**
   * Verify if a value is in an array, then throw if not
   * @param arr - The array
   * @param value - The value needed
   * @param name - Use to trace in the error
   * @returns
   *
   * @public
   */
  isIn(arr: any[], value: any, name: string = '') {
    if (!this.isArray(arr)) {
      return false;
    }

    if (!arr.includes(value)) {
      return this.send(`ERR_VALUE_NOT_IN_GROUP ${name}/${value}`);
    }

    return true;
  }

  /**
   * Verify if an object is an instance of a specific type, then throw if not
   * @param obj - The object to verify
   * @param instance - The instance needed
   * @returns
   *
   * @public
   */
  isInstanceOf(obj: any, instance: any): boolean {
    if (!(obj instanceof instance)) {
      return this.send('ERR_NEED_SPECIFIC_INSTANCE_TYPE');
    }

    return true;
  }

  /**
   * Throw an error or return false the checker is not instanciated with toThrow option
   *
   * @param message - The message to print
   * @returns
   *
   * @public
   */
  protected send(message: string): boolean {
    if (this.toThrow) {
      Thrower.generic(message);
    }

    return false;
  }
}

export default Checker;
