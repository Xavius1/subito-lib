[Documentation](https://github.com/Xavius1/subito-doc/blob/master/doc/index.md)

This package define & use theses following envs:
| NAME | type | default value | allowed values |
| ---- | ---- | ------------- | -------------- |
| CRYPTO_IV_HASH | secret | dev |  |
| DEFAULT_TIMEZONE | var | Europe/Paris |  |
| DEFAULT_LOCALE | var | fr |  |
| DEFAULT_DATE_FORMAT | var | YYYY-MM-DDTHH:mm:ss.SSS |  |
| JWT_KEY | secret | dev |  |
| TOKEN_MAX_VALIDITY | var(int) | 7 |  |
| TOKEN_VALIDITY_DEV | var(int) | 1 |  |

These ones can not be changed:

| APP_ENV | env | local | ['local', 'current', 'develop', 'integration', 'staging', 'production'] |
| NODE_ENV | env | development | ['development', 'test', 'production'] |
| FORCE_DEBUG | var(bool) | false |  |
| PWD | env | /app |  |
| INTERNAL_GRAPHQL_ENDPOINT | env | http://graphql-endpoint/ |  |
| SERVICE_AUTH_KEY | secret | dev |  |
 