class Thrower {
    static generic(message) {
        throw new Error(message);
    }
    static forbidden() {
        Thrower.generic('ERR_ACCESS_RIGHTS');
    }
    static unauthorized() {
        Thrower.generic('ERR_BAD_CREDENTIAL');
    }
}
export default Thrower;
