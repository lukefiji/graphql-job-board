const endpointURL = 'http://localhost:9000/graphql';

/**
 * Send the GraphQL query as an HTTP request
 * Prefix variables with `$`
 * Parameters require types
 */

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(endpointURL, {
    method: 'POST',
    // Set request content-type to JSON
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
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
  const query = `
  {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }`;
  const { jobs } = await graphqlRequest(query);
  return jobs;
}

export async function loadJob(id) {
  const query = `
  query JobQuery($id: ID!) {
    job(id: $id ) {
      id
      title
      company {
        id
        name
      }
      description
    }
  }`;
  const { job } = await graphqlRequest(query, { id });
  return job;
}

export async function loadCompany(id) {
  const query = `
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
  const { company } = await graphqlRequest(query, { id });
  return company;
}
