import Thrower from './Thrower.js';
class Checker {
    constructor(toThrow) {
        this.toThrow = false;
        if (toThrow) {
            this.toThrow = toThrow;
        }
    }
    isArray(arr) {
        if (!this.isArray(arr)) {
            this.send('ERR_NEED_ARRAY');
        }
        return true;
    }
    isEmpty(arr) {
        this.isArray(arr);
        if (arr.length === 0) {
            this.send('ERR_EMPTY_ARRAY');
        }
        return true;
    }
    isEquals(obj, value) {
        this.isExists(obj);
        this.isExists(value);
        if (obj !== value) {
            this.send('ERR_NEED_OBJ_MATCH_VALUE');
        }
        return true;
    }
    isExists(obj, name = '') {
        if (!obj) {
            this.send(`ERR_NEED_NOT_NULL_OBJ ${name}`);
        }
        return true;
    }
    isIn(arr, value, name = '') {
        this.isArray(arr);
        if (!arr.includes(value)) {
            this.send(`ERR_VALUE_NOT_IN_GROUP ${name}/${value}`);
        }
        return true;
    }
    isInstanceOf(obj, instance) {
        if (!(obj instanceof instance)) {
            this.send('ERR_NEED_SPECIFIC_INSTANCE_TYPE');
        }
        return true;
    }
    send(message) {
        if (this.toThrow) {
            Thrower.generic(message);
        }
        return false;
    }
}
export default Checker;
