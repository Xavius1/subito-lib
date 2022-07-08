import { gql } from 'graphql-request';

/**
 * Query to auth a service
 */
const SERVICE_AUTH = gql`
  mutation serviceAuth($service: String!, $secret: String!) {
    # auth namespace handle by api-auth micro service
    auth {
      # Service entity
      Service {
        # Service.auth mutation to get a token for a service
        auth(input: { service: $service, secret: $secret }) {
          # Bool
          success
          # Auth data
          auth {
            # The token string
            token
            # Should return a Date format
            expirationDate
          }
        }
      }
    }
  }
`;

export default SERVICE_AUTH;
