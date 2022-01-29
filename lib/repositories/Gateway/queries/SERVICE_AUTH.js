import { gql } from 'graphql-request';
const SERVICE_AUTH = gql `
  mutation serviceAuth($service: String!, $secret: String!) {
    serviceAuth(input: { service: $service, secret: $secret }) {
      success
      auth {
        token
      }
    }
  }
`;
export default SERVICE_AUTH;
