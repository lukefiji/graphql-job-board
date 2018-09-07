import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from 'apollo-boost';
import gql from 'graphql-tag';
import { getAccessToken, isLoggedIn } from './auth';

const endpointURL = 'http://localhost:9000/graphql';

/**
 * A custom Apollo Link instance used in Apollo Client
 * used in the configuration for ApolloLink.from()
 * That takes an array of Apollo Link instances and
 * combines them together
 */
const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    // Setting a header in the operation context which
    // will be used by HttpLink when making the HTTP request
    operation.setContext({
      headers: {
        authorization: 'Bearer ' + getAccessToken()
      }
    });
  }
  // Forward lets us chain multiple steps together
  // - Forward operation to the next step
  return forward(operation);
});

// Create and configure a new Apollo client
const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: endpointURL })]),
  cache: new InMemoryCache()
});

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
    // Force `no-cache` /w this fetch policy
  } = await client.query({ query, fetchPolicy: 'no-cache' });
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
