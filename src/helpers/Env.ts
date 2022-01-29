/* eslint-disable no-underscore-dangle */

import Checker from './Checker.js';
import Data from './Data.js';
import Thrower from './Thrower.js';
import type { ParseType } from './Data.js';

const checker = new Checker(true);

const ensureScope = function ensureScope(scope: string[] | 'all' | undefined) {
  if (Array.isArray(scope)
  && (scope.includes('staging') || scope.includes('production'))
  ) {
    Thrower.generic('DEFAULT_ENV_SCOPE_NOT_ALLOWED');
  }
};

type SecretEnv = { type?: string, defaultValue: string }
const ensureSecretEnv = function ensureSecretEnv({ type, defaultValue }: SecretEnv) {
  if (type === 'secret' && defaultValue.length > 5) {
    Thrower.generic('SECRET_ENV_CANT_HAVE_LENGTH_MORE_THAN_FIVE');
  }
};

type DefineEnv = { name: string, defaultValue: any, scope?: (string)[] | 'all' }
const defineEnv = function defineEnv({ name, defaultValue, scope }: DefineEnv) {
  let env = process.env[name]; // eslint-disable-line node/no-process-env
  if (!env) {
    const { APP_ENV } = process.env; // eslint-disable-line node/no-process-env
    if (
      defaultValue === undefined
      || (scope === 'all' && ['staging', 'production'].includes(APP_ENV))
      || (scope !== 'all' && scope && !scope.includes(APP_ENV))
    ) {
      checker.isExists(env, name);
    }
    env = defaultValue;
  }

  return env;
};

type EnvOptions = {
  allow?: any[], type?: ParseType, defaultValue?: any, scope?: 'all' | string[],
  }

type EnvList = [string, EnvOptions][];

class Env {
  private static get(name: string, {
    allow, type, defaultValue, scope = 'all',
  }: EnvOptions = {}) {
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

  static getAll(list: EnvList): any {
    const envs: any = {
      _recipe: list,
      _defaultValues: {},
      _allowedValues: {},
      _scopes: {},
      _types: {},
    };
    const errors: any = [];

    list.forEach(([name, config = {}]) => {
      try {
        envs[name] = Env.get(name, config);
        const {
          defaultValue, allow, type, scope,
        } = config;
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
      } catch (err: any) {
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
