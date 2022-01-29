/* eslint-disable no-underscore-dangle */
import Checker from './Checker.js';
import Data from './Data.js';
import Thrower from './Thrower.js';
const checker = new Checker(true);
const ensureScope = function ensureScope(scope) {
    if (Array.isArray(scope)
        && (scope.includes('staging') || scope.includes('production'))) {
        Thrower.generic('DEFAULT_ENV_SCOPE_NOT_ALLOWED');
    }
};
const ensureSecretEnv = function ensureSecretEnv({ type, defaultValue }) {
    if (type === 'secret' && defaultValue.length > 5) {
        Thrower.generic('SECRET_ENV_CANT_HAVE_LENGTH_MORE_THAN_FIVE');
    }
};
const defineEnv = function defineEnv({ name, defaultValue, scope }) {
    let env = process.env[name]; // eslint-disable-line node/no-process-env
    if (!env) {
        const { APP_ENV } = process.env; // eslint-disable-line node/no-process-env
        if (defaultValue === undefined
            || (scope === 'all' && ['staging', 'production'].includes(APP_ENV))
            || (scope !== 'all' && scope && !scope.includes(APP_ENV))) {
            checker.isExists(env, name);
        }
        env = defaultValue;
    }
    return env;
};
class Env {
    static get(name, { allow, type, defaultValue, scope = 'all', } = {}) {
        ensureScope(scope);
        ensureSecretEnv({ type, defaultValue });
        const env = defineEnv({ name, defaultValue, scope });
        const data = new Data(env);
        const value = data.parseType(type);
        if (type !== 'Bool') {
            checker.isExists(value, name);
        }
        if (allow) {
            checker.isIn(allow, value, name);
        }
        return value;
    }
    static getAll(list) {
        const envs = {
            _recipe: list,
            _defaultValues: {},
            _allowedValues: {},
            _scopes: {},
            _types: {},
        };
        const errors = [];
        list.forEach(([name, config = {}]) => {
            try {
                envs[name] = Env.get(name, config);
                const { defaultValue, allow, type, scope, } = config;
                if (defaultValue || defaultValue === false) {
                    envs._defaultValues[name] = defaultValue;
                }
                if (allow) {
                    envs._allowedValues[name] = allow;
                }
                if (type) {
                    envs._types[name] = type;
                }
                if (scope) {
                    envs._scopes[name] = scope;
                }
            }
            catch (err) {
                errors.push(err.message);
            }
        });
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
        return envs;
    }
}
export default Env;
