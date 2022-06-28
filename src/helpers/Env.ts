import Checker from './Checker.js';
import Data from './Data.js';
import Thrower from './Thrower.js';
import type { ParseType } from './Data.js';

const checker = new Checker(true);

type SecretEnv = { type?: string, defaultValue: string }
const ensureSecretEnv = function ensureSecretEnv({ type, defaultValue }: SecretEnv) {
  if (type === 'secret' && defaultValue.length > 5) {
    Thrower.generic('SECRET_ENV_CANT_HAVE_LENGTH_MORE_THAN_FIVE');
  }
};

type DefineEnv = { name: string, defaultValue: any, fallback?: string }
const defineEnv = function defineEnv(args: DefineEnv) {
  const { name, defaultValue, fallback } = args;
  let value = process.env[name]; // eslint-disable-line node/no-process-env

  const { APP_ENV } = process.env; // eslint-disable-line node/no-process-env
  if (!value && fallback && !['staging', 'production'].includes(APP_ENV)) {
    value = process.env[fallback]; // eslint-disable-line node/no-process-env
  }

  if (!value) {
    if (defaultValue === undefined || ['staging', 'production'].includes(APP_ENV)) {
      checker.isExists(value, name);
    }
    value = defaultValue;
  }

  return value;
};

export type EnvConfig = {
  allow?: any[], type?: ParseType, defaultValue: any, fallback?: string,
  }

export type ReservedEnvVar = [('APP_ENV' | 'NODE_ENV')];
export type EnvVar = [string, EnvConfig];
export type EnvList = (EnvVar | ReservedEnvVar)[];

class Env {
  private static get(name: string, {
    allow, type, defaultValue, fallback,
  }: EnvConfig) {
    ensureSecretEnv({ type, defaultValue });

    const env = defineEnv({ name, defaultValue, fallback });

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
      _fallbacks: {},
      _types: {},
    };
    const errors: any = [];

    list.forEach(([name, defaultConfig = {}]) => {
      try {
        const config = Env.getEnvConfig(name, defaultConfig);
        envs[name] = Env.get(name, config);
        const {
          defaultValue, allow, type, fallback,
        } = config;
        if (defaultValue || defaultValue === false) {
          envs._defaultValues[name] = defaultValue; // eslint-disable-line no-underscore-dangle
        }
        if (allow) {
          envs._allowedValues[name] = allow; // eslint-disable-line no-underscore-dangle
        }
        if (type) {
          envs._types[name] = type; // eslint-disable-line no-underscore-dangle
        }
        if (fallback) {
          envs._fallbacks[name] = fallback; // eslint-disable-line no-underscore-dangle
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
