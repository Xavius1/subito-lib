/**
 * The parse types
 * @public
 */
export type ParseType = 'Array' | 'Bool' | 'Float' | 'Int' | 'secret' | undefined;

/**
 * Handles some data stuff
 * @public
 */
class Data {
  private value: any;

  constructor(value: any) {
    this.value = value;
  }

  /**
   * Parse data
   *
   * @param type - The format to parse
   * @returns
   *
   * @public
   */
  parseType(type: ParseType): any {
    const { value } = this;
    // const tmpVar = null;
    switch (type) {
      case 'Array':
        return value.split(',');
      case 'Bool':
        return (value === true || value === 'true');
      case 'Float':
        this.value = parseFloat(value);
        return this.NaNtoNull();
      case 'Int':
        this.value = parseInt(value, 10);
        return this.NaNtoNull();
      default:
        return value;
    }
  }

  /**
   * Uppercase the first character of a string then lowercase the rest of it
   *
   * @returns
   *
   * @public
   */
  ucfirst() {
    const { value } = this;
    return value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
  }

  /**
   * Transform a NaN value to  null
   *
   * @returns
   *
   * @public
   */
  NaNtoNull() {
    const { value } = this;
    if (Number.isNaN(value)) {
      return null;
    }
    return value;
  }
}

export default Data;
