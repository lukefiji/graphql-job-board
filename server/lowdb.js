const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const companies = [
  {
    id: 'HJRa-DOuG',
    name: 'Facegle',
    description:
      'We are a startup on a mission to disrupt social search engines. Think Facebook meet Google.'
  },
  {
    id: 'SJV0-wdOM',
    name: 'Goobook',
    description:
      'We are a startup on a mission to disrupt search social media. Think Google meet Facebook.'
  }
];

const jobs = [
  {
    id: 'rJKAbDd_z',
    companyId: 'HJRa-DOuG',
    title: 'Frontend Developer',
    description: 'We are looking for a Frontend Developer familiar with React.'
  },
  {
    id: 'SJRAZDu_z',
    companyId: 'HJRa-DOuG',
    title: 'Backend Developer',
    description:
      'We are looking for a Backend Developer familiar with Node.js and Express.'
  },
  {
    id: 'rkz1GwOOM',
    companyId: 'SJV0-wdOM',
    title: 'Full-Stack Developer',
    description:
      'We are looking for a Full-Stack Developer familiar with Node.js, Express, and React.'
  }
];

const users = [
  {
    id: 'BJrp-DudG',
    email: 'alice@facegle.io',
    password: 'alice123',
    companyId: 'HJRa-DOuG'
  },
  {
    id: 'ry9pbwdOz',
    email: 'bob@goobook.co',
    password: 'bob123',
    companyId: 'SJV0-wdOM'
  }
];

db.defaults({
  companies,
  jobs,
  users
}).write();

module.exports = { db };
