class Thrower {
  static generic(message: string): never {
    throw new Error(message);
  }

  static forbidden(): never {
    Thrower.generic('ERR_ACCESS_RIGHTS');
  }

  static unauthorized(): never {
    Thrower.generic('ERR_BAD_CREDENTIAL');
  }
}

export default Thrower;
