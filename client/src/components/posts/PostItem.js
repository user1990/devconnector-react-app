import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { deletePost, addLike, removeLike } from '../../redux/reducers';

class PostItem extends Component {
  handleDeletePost = id => {
    this.props.deletePost(id);
  };

  handleLikePost = id => {
    this.props.addLike(id);
  };

  handleUnlikePost = id => {
    this.props.removeLike(id);
  };

  handleFindUserLike = likes => {
    const { auth } = this.props;
    // Check IF user is likes array
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      // User liked post comment
      return true;
    }
    return false;
  };

  render() {
    const { post, auth, showActions } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt="profile-avatar"
              />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <span>
                <button
                  onClick={() => this.handleLikePost(post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i
                    className={
                      this.handleFindUserLike(post.likes)
                        ? 'fas fa-thumbs-up text-info'
                        : 'fas fa-thumbs-up'
                    }
                  />
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <button
                  onClick={() => this.handleUnlikePost(post._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user.id ? (
                  <button
                    onClick={() => this.handleDeletePost(post._id)}
                    type="button"
                    className="btn btn-danger mr-1"
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike })(
  PostItem
);
