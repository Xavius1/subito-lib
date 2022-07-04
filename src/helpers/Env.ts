import Checker from './Checker';
import Data from './Data';
import Thrower from './Thrower';
import type { ParseType } from './Data';

const checker = new Checker(true);

export enum EnvType {
  SECRET,
  ENV,
  VAR
}

type SecretEnv = { type?: EnvType, defaultValue: string }

/**
 * @internal
 */
const ensureSecretEnv = function ensureSecretEnv({ type, defaultValue }: SecretEnv) {
  if (type === EnvType.SECRET && defaultValue.length > 5) {
    Thrower.generic('SECRET_ENV_CANT_HAVE_LENGTH_MORE_THAN_FIVE');
  }
};

type DefineEnv = { name: string, type: EnvType, defaultValue: any, fallback?: string }

/**
 * @internal
 */
const canAlias = function canAlias(type: EnvType) {
  const { APP_ENV } = process.env; // eslint-disable-line node/no-process-env

  return (!['staging', 'production'].includes(APP_ENV) || type === EnvType.VAR);
};

/**
 * @internal
 */
const defineEnv = function defineEnv(args: DefineEnv) {
  const {
    name, type, defaultValue, fallback,
  } = args;
  let value = process.env[name]; // eslint-disable-line node/no-process-env

  if (!value && fallback && canAlias(type)) {
    value = process.env[fallback]; // eslint-disable-line node/no-process-env
  }

  if (!value) {
    if (defaultValue === undefined && canAlias(type)) {
      checker.isExists(value, name);
    }
    value = defaultValue;
  }

  return value;
};

export type EnvCustomConfig = {
  allow?: any[], parseType?: ParseType, defaultValue: any, fallback?: string,
}

export type EnvConfig = {
  allow?: any[], type: EnvType, parseType?: ParseType, defaultValue: any, fallback?: string,
}

export type ReservedEnvVar = [('APP_ENV' | 'NODE_ENV' | 'PWD')];
export type EnvVar = [string, EnvConfig];
export type EnvList = (EnvVar | ReservedEnvVar)[];

/**
 * @public
 */
class Env {
  private static get(name: string, {
    allow, type, parseType, defaultValue, fallback,
  }: EnvConfig) {
    ensureSecretEnv({ type, defaultValue });

    const env = defineEnv({
      name, type, defaultValue, fallback,
    });

    const data = new Data(env);
    const value = data.parseType(parseType);
    if (parseType !== 'Bool') {
      checker.isExists(value, name);
    }
    if (allow) {
      checker.isIn(allow, value, name);
    }

    return value;
  }

  /**
   * @internal
   */
  private static getEnvConfig(name: string, defaultConfig: any) {
    switch (name) {
      case 'APP_ENV':
        return { defaultValue: 'local', allow: ['local', 'current', 'develop', 'integration', 'staging', 'production'] };
      case 'NODE_ENV':
        return { defaultValue: 'development', allow: ['development', 'test', 'production'] };
      case 'PWD':
        return { defaultValue: '/app' };
      default:
        return defaultConfig;
    }
  }

  /**
   * Get a list of env vars
   *
   * @param list - An array of env configs
   * @returns
   *
   * @public
   */
  static getAll(list: EnvList): any {
    const envs: any = {
      _recipe: list,
      _defaultValues: {},
      _allowedValues: {},
      _fallbacks: {},
      _types: {},
      _parseTypes: {},
    };
    const errors: any = [];

    list.forEach(([name, defaultConfig = {}]) => {
      try {
        const config = Env.getEnvConfig(name, defaultConfig);
        envs[name] = Env.get(name, config);
        const {
          defaultValue, allow, type, parseType, fallback,
        } = config;
        if (defaultValue || defaultValue === false) {
          envs._defaultValues[name] = defaultValue; // eslint-disable-line no-underscore-dangle
        }
        if (allow) {
          envs._allowedValues[name] = allow; // eslint-disable-line no-underscore-dangle
        }
        if (type !== undefined) {
          envs._types[name] = type; // eslint-disable-line no-underscore-dangle
        }
        if (parseType) {
          envs._parseTypes[name] = parseType; // eslint-disable-line no-underscore-dangle
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

  /**
   * Get the config of a new secret env
   *
   * @param name - The name of the new secret env
   * @returns
   *
   * @public
   */
  static newSecret(name: string): EnvVar {
    return [name.toUpperCase(), { defaultValue: 'dev', type: EnvType.SECRET }];
  }

  /**
   * Get the config of a new environment dependent variable
   *
   * @param name - The name of the new var
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  static newEnv(name: string, config: EnvCustomConfig): EnvVar {
    return [name.toUpperCase(), { ...config, type: EnvType.ENV }];
  }

  /**
   * Get the config of a new non-environment dependent variable
   *
   * @param name - The name of the new var
   * @param config - Custom env config
   * @returns
   *
   * @public
   */
  static newVar(name: string, config: EnvCustomConfig): EnvVar {
    return [name.toUpperCase(), { ...config, type: EnvType.VAR }];
  }
}

export default Env;
