/* eslint-disable no-underscore-dangle */

import Checker from './Checker.js';
import Data from './Data.js';
import Thrower from './Thrower.js';
import type { ParseType } from './Data.js';
import Logger from '../repositories/Logger/Logger.js';

const checker = new Checker(true);

const isStrictEnvMode = function isStrictEnvMode() {
  const { SUBITO_STRICT_ENV_MODE } = process.env; // eslint-disable-line node/no-process-env
  return new Data(SUBITO_STRICT_ENV_MODE).parseType('Bool');
};

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
const defineEnv = function defineEnv(args: DefineEnv) {
  const { name, defaultValue, scope } = args;
  let value = process.env[name]; // eslint-disable-line node/no-process-env
  if (!value) {
    const { APP_ENV } = process.env; // eslint-disable-line node/no-process-env
    if (
      isStrictEnvMode()
      || defaultValue === undefined
      || (scope === 'all' && ['staging', 'production'].includes(APP_ENV))
      || (scope !== 'all' && scope && !scope.includes(APP_ENV))
    ) {
      checker.isExists(value, name);
    }
    value = defaultValue;
    Logger.newWarning('WARN_ENV', `Default value ${name}=${value} because the env var ${name}
    is not set in your environment, set the env var to remove this warning.`, args);
  }

  return value;
};

export type EnvConfig = {
  allow?: any[], type?: ParseType, defaultValue: any, scope?: 'all' | string[],
  }

export type ReservedEnvVar = [('APP_ENV' | 'NODE_ENV')];
export type EnvVar = [string, EnvConfig];
export type EnvList = (EnvVar | ReservedEnvVar)[];

class Env {
  private static get(name: string, {
    allow, type, defaultValue, scope = 'all',
  }: EnvConfig) {
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

  private static getEnvConfig(name: string, defaultConfig: any) {
    switch (name) {
      case 'APP_ENV':
        return { defaultValue: 'local', allow: ['local', 'current', 'develop', 'integration', 'staging', 'production'] };
      case 'NODE_ENV':
        return { defaultValue: 'development', allow: ['development', 'test', 'production'] };
      default:
        return defaultConfig;
    }
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

    list.forEach(([name, defaultConfig = {}]) => {
      try {
        const config = Env.getEnvConfig(name, defaultConfig);
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

  static newSecret(name: string): EnvVar {
    return [name.toUpperCase(), { defaultValue: 'dev', type: 'secret' }];
  }
}

export default Env;
