const endpointURL = 'http://localhost:9000/graphql';

export async function loadJobs() {
  const response = await fetch(endpointURL, {
    method: 'POST',
    // Set request content-type to JSON
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      // Send the GraphQL query as an HTTP request
      query: `
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
      `
    })
  });
  const responseBody = await response.json();
  return responseBody.data.jobs;
}