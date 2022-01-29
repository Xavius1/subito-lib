/**
 * Class use to make some usual math stuff
 * Like round a number or apply/remove a rate to a price
 * @public
 */
class Calculator {
  /**
   * Apply a rate to a value
   *
   * @example
   * We want to apply a VAT rate (20%) to a price (10€)
   * ```
   * // Prints "12":
   * console.log(Calculator.addRate(10, 20));
   * ```
   *
   * @param value - Base value to raise
   * @param rate - Rate value to apply
   * @returns
   */
  static addRate(value: number, rate: number) {
    return Calculator.round(value * Calculator.coefFromRate(rate));
  }

  /**
   * Get the multiplier of a rate
   *
   * @example
   * We want the multiplier of a VAT rate (20%)
   * ```
   * // Prints "1.2":
   * console.log(Calculator.coefFromRate(20));
   * ```
   *
   * @param rate - Rate value to apply
   * @returns
   */
  static coefFromRate(rate: number) {
    return Calculator.round(1 + (rate / 100), 4);
  }

  /**
   * Get the value represents of a rate applied to a number
   *
   * @example
   * How represents 20% of 12€ ?
   * ```
   * // Prints "2.4":
   * console.log(Calculator.valueFromRate(12, 20));
   * ```
   *
   * @param value - Base value to take
   * @param rate - Rate value to apply
   * @returns
   */
  static valueFromRate(value: number, rate: number) {
    return Calculator.round((value * rate) / 100);
  }

  /**
   * Remove a rate from a value
   *
   * @example
   * We want to remove a VAT rate (20%) from a price (12€)
   * ```
   * // Prints "10":
   * console.log(Calculator.removeRate(12, 20));
   * ```
   *
   * @param value - Base value to raise
   * @param rate - Rate value to apply
   * @returns
   */
  static removeRate(value: number, rate: number) {
    return Calculator.round(value / Calculator.coefFromRate(rate));
  }

  /**
   * Round a value according to wished decimals
   *
   * @example
   * We want to round 3.14159265 with only 4 decimals
   * ```
   * // Prints "3.1416":
   * console.log(Calculator.round(3.14159265, 4));
   * ```
   *
   * @param value - Base value to round
   * @param decimals - Number of decimals (2 is applied by default)
   * @returns
   */
  static round(value: number, decimals?: number) {
    let precision = 2;
    if (decimals && decimals >= 0) {
      precision = decimals;
    }
    return +(`${Math.round(Number(`${value}e${precision}`))}e-${precision}`);
  }
}

export default Calculator;
