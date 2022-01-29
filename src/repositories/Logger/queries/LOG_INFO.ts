import { gql } from 'graphql-request';

const LOG_INFO = gql`
  mutation log($message: String!, $trigger: String!, $trace: String!, $context: JSONObject!) {
    log {
      newInfo(input: { message: $message, trigger: $trigger, trace: $trace, context: $context }) {
        code
        success
        node {
          id
        }
      }
    }
  }
`;

export default LOG_INFO;
