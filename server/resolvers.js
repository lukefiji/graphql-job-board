const db = require('./db');

// Resolves how each request is handled
const Query = {
  jobs: () => db.jobs.list()
};

// `Job` type resolver
const Job = {
  // Company is a foriegn key in this case
  // Return the company whose ID is the same as the company ID of this job
  // This function resolves a company for a given job
  company: job => db.companies.get(job.companyId) // Match Job's foreign key /w a Company's ID
};

module.exports = { Query, Job };
