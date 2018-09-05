import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { loadJob } from './requests';

export class JobDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { job: null };
  }

  async componentDidMount() {
    // Get jobId from React Router route parameter
    const { jobId } = this.props.match.params;
    const job = await loadJob(jobId);
    this.setState({ job });
  }

  render() {
    const { job } = this.state;

    // Return null if job doesn't exist
    if (!job) {
      return null;
    }

    return (
      <div>
        <h1 className="title">{job.title}</h1>
        <h2 className="subtitle">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">{job.description}</div>
      </div>
    );
  }
}
