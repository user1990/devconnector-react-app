import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import keys from '../../config/keys';

class ProfileGithub extends Component {
  state = {
    githubClientId: keys.githubClientId,
    githubClientSecret: keys.githubClientSecret,
    count: 5,
    sort: 'created:asc',
    repos: [],
  };

  componentDidMount = async () => {
    const { username } = this.props;
    const { count, sort, githubClientId, githubClientSecret } = this.state;

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
    );
    const reposeJsonData = await response.json();

    if (this.refs.reposRef) {
      this.setState({ repos: reposeJsonData });
    }
  };

  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));

    return (
      <div ref="reposRef" className="profile-github">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
};

export default ProfileGithub;
