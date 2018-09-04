const db = require('./db');

// Resolves how each request is handled
const Query = {
  jobs: () => db.jobs.list()
};

module.exports = { Query };
