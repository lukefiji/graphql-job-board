import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import { getAccessToken, isLoggedIn } from './auth';

const endpointURL = 'http://localhost:9000/graphql';

// Create and configure a new Apollo client
const client = new ApolloClient({
  link: new HttpLink({ uri: endpointURL }),
  cache: new InMemoryCache()
});

/**
 * Send the GraphQL query as an HTTP request
 * Prefix variables with `$`
 * Parameters require types
 */
async function graphqlRequest(query, variables = {}) {
  const request = {
    method: 'POST',
    // Set request content-type to JSON
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables })
  };

  if (isLoggedIn()) {
    request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }

  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();

  // You will only see these messages in dev mode
  // Production builds will hide errors
  if (responseBody.errors) {
    const message = responseBody.errors.map(error => error.message).join('\n');
    throw new Error(message);
  }

  return responseBody.data;
}

export async function loadJobs() {
  // Tagged function via gql
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  // Create a query, passing in a structuerec object
  const {
    data: { jobs }
  } = await client.query({ query });
  return jobs;
}

export async function loadJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;
  const {
    data: { job }
    // Pass in a variable via Apollo Client queries
  } = await client.query({ query, variables: { id } });
  return job;
}

export async function createJob(input) {
  // `job` is an alias for `createJob`
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  // Mutations are set via `client.mutate()`
  const {
    data: { job }
  } = await client.mutate({ mutation, variables: { input } });
  return job;
}

export async function loadCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        description
        name
        jobs {
          id
          title
        }
      }
    }
  `;
  const {
    data: { company }
  } = await client.query({ query, variables: { id } });
  return company;
}
