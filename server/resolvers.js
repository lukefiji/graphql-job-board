const db = require('./db');

// Resolves how each request is handled
const Query = {
  jobs: () => db.jobs.list(),
  /**
   * Passing GraphQL arguments:
   * First argument - parent value (root object in this case)
   * Second argument - arguments in the GraphQL query
   */
  job: (root, { id }) => db.jobs.get(id),
  company: (root, { id }) => db.companies.get(id)
};

const Mutation = {
  // Input object comes from schema
  // Third parameter = context
  createJob: (root, { input }, { user }) => {
    // Check user auth passed in from context via middleware
    if (!user) {
      throw new Error('Unauthorized');
      return null;
    }

    // Return a job ID
    const id = db.jobs.create({
      companyId: user.companyId,
      ...input
    });
    // Return the new job
    return db.jobs.get(id);
  }
};

// `Job` type resolver
const Job = {
  // Company is a foriegn key in this case
  // Return the company whose ID is the same as the company ID of this job
  // This function resolves a company for a given job
  company: job => db.companies.get(job.companyId) // Match Job's foreign key /w a Company's ID
};

const Company = {
  // Company is the parent object (root)
  // One-to-many relationship between company and job
  jobs: company => db.jobs.list().filter(job => job.companyId === company.id)
};

module.exports = { Query, Job, Company, Mutation };
