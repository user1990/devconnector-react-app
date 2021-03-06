import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addComment } from '../../redux/reducers';

class CommentForm extends Component {
  static getDerivedStateFromProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  state = {
    text: '',
    errors: {},
  };

  onSubmit = e => {
    e.preventDefault();

    const { user } = this.props.auth;
    const { postId } = this.props;

    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar,
    };

    this.props.addComment(postId, newComment);

    if (this.state.text.length > 10) {
      this.setState({ text: '' });
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { errors, text } = this.state;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Reply to post"
                  name="text"
                  value={text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { addComment })(CommentForm);
