![NPM](https://img.shields.io/npm/l/subito-lib?color=blue&style=for-the-badge) ![npm](https://img.shields.io/npm/v/subito-lib?style=for-the-badge)

[API Documentation](https://github.com/Xavius1/subito-doc/blob/main/doc/index.md)

This package define & use theses following env vars.
These vars are automatically available into your micro-service.

| NAME | type | default value | allowed values | immutable |
| ---- | ---- | ------------- | -------------- | --------- |
| APP_ENV | env | local | local, current, develop, integration, staging, production | true |
| CRYPTO_IV_HASH | secret | dev |  |  |
| DEFAULT_TIMEZONE | var | Europe/Paris |  |  |
| DEFAULT_LOCALE | var | fr |  | false |
| DEFAULT_DATE_FORMAT | var | YYYY-MM-DDTHH:mm:ss.SSS |  |  |
| INTERNAL_GRAPHQL_ENDPOINT | env | <http://graphql-endpoint/> |  | true |
| FORCE_DEBUG | var(bool) | false |  | true |
| JWT_KEY | secret | dev |  | true |
| NODE_ENV | env | development | development, test, production | true |
| PWD | env | /app |  | true |
| SERVICE_AUTH_KEY | secret | dev |  | true |
| TOKEN_MAX_VALIDITY | var(int) | 7 |  |  |
| TOKEN_VALIDITY_DEV | var(int) | 1 |  |  |
