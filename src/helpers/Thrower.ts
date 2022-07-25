/**
 * Aliases to throw some specifics errors
 * @public
 */
class Thrower {
  /**
   * Throw a generic error
   * @param message - The message to print
   *
   * @public
   */
  static generic(message: string): never {
    throw new Error(message);
  }

  /**
   * Throw a forbidden error
   * @public
   */
  static forbidden(): never {
    Thrower.generic('ERR_ACCESS_RIGHTS');
  }

  /**
   * Throw an unauthorized error
   * @public
   */
  static unauthorized(): never {
    Thrower.generic('ERR_BAD_CREDENTIAL');
  }
}

export default Thrower;
