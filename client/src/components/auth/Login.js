import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginUser } from '../../redux/reducers';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  static getDerivedStateFromProps = nextProps => {
    // Check IF user is authenticated
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  state = {
    email: '',
    password: '',
    errors: {},
  };

  componentDidMount = () => {
    // Check IF user is authenticated
    const isAuth = this.props.auth.isAuthenticated;
    if (isAuth) {
      this.props.history.push('/dashboard');
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;
    const userCredentials = {
      email,
      password,
    };

    this.props.loginUser(userCredentials);
  };

  render() {
    const { email, password, errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={password}
                  autoComplete="new-password"
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
