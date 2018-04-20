import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getProfileByHandle } from '../../redux/reducers';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import Spinner from '../common/Spinner';

class Profile extends Component {
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    if (handle) {
      this.props.getProfileByHandle(handle);
    }
  };

  componentWillReceiveProps = nextProps => {
    const { profile } = nextProps.profile;
    const { loading } = this.props.profile;
    if (profile === null && loading) {
      this.props.history.push('/not-found');
    }
  };

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link>
            </div>
            <div className="col-md-6">
              <ProfileHeader profile={profile} />
              <ProfileAbout profile={profile} />
              <ProfileCreds
                education={profile.education}
                experience={profile.experience}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="profile">
          <div className="container">
            <div className="row">
              <div className="col-md-12">{profileContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  getProfileByHandle: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
