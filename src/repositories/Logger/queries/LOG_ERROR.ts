import { gql } from 'graphql-request';

const LOG_ERROR = gql`
  mutation log($code: String, $message: String!, $trigger: String!, $trace: String!, $input: JSONObject, $context: JSONObject!) {
    log {
      newError(input: { code: $code, message: $message, trigger: $trigger, trace: $trace, input: $input, context: $context }) {
        code
        success
        node {
          id
        }
      }
    }
  }
`;

export default LOG_ERROR;
