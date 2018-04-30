import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthorizationHeader from '../utils/setAuthorizationHeader';
import isEmpty from '../validation/isEmpty';

/***** CONSTANTS *****/
export const actionTypes = {
  // Errors
  GET_ERRORS: 'GET/ERRORS',
  CLEAR_ERRORS: 'CLEAR/ERRORS',
  // USER
  SET_CURRENT_USER: 'SET/CURRENT_USER',
  // PROFILE
  GET_PROFILE: 'GET/PROFILE',
  GET_PROFILES: 'GET/PROFILES',
  CLEAR_CURRENT_PROFILE: 'CLEAR/CURRENT_PROFILE',
  PROFILE_NOT_FOUND: 'PROFILE/NOT_FOUND',
  PROFILE_LOADING: 'PROFILE/LOADING',
  // POSTS
  POST_LOADING: 'POST/LOADING',
  GET_POSTS: 'GET/POSTS',
  GET_POST: 'GET/POST',
  ADD_POST: 'ADD/POST',
  DELETE_POST: 'DELETE/POST',
};

/***** ACTIONS *****/
// Errors
export const getErrors = err => ({
  type: actionTypes.GET_ERRORS,
  payload: err.response.data,
});

// AUTH
// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(error => dispatch(getErrors(error)));
};

// Set Logged in user
export const setCurrentUser = decodedUserData => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: decodedUserData,
});

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save to localstorage
      const { token } = res.data;
      // Set token to localStorage
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthorizationHeader(token);
      // Decode token to get user data
      const decodedUserData = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decodedUserData));
    })
    .catch(error => dispatch(getErrors(error)));
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthorizationHeader(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// PROFILE
// Profile loading
export const setProfileLoading = () => ({
  type: actionTypes.PROFILE_LOADING,
});

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data,
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: {},
      })
    );
};

// Get current profile
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data,
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: null,
      })
    );
};

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(error => dispatch(getErrors(error)));
};

// Clear profile
export const clearCurrentProfile = () => ({
  type: actionTypes.CLEAR_CURRENT_PROFILE,
});

// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post('/api/profile/experience', expData)
    .then(res => history.push('/dashboard'))
    .catch(error => dispatch(getErrors(error)));
};

// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post('/api/profile/education', eduData)
    .then(res => history.push('/dashboard'))
    .catch(error => dispatch(getErrors(error)));
};

// Delete Experience
export const deleteExperience = id => dispatch => {
  axios
    .delete(`/api/profile/experience/${id}`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data,
      })
    )
    .catch(error => dispatch(getErrors(error)));
};

// Delete Education
export const deleteEducation = id => dispatch => {
  axios
    .delete(`/api/profile/education/${id}`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data,
      })
    )
    .catch(error => dispatch(getErrors(error)));
};

// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile/all')
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILES,
        payload: res.data,
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_PROFILES,
        payload: null,
      })
    );
};

// Delete account & profile
export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    axios
      .delete('/api/profile')
      .then(res => {
        dispatch({
          type: actionTypes.SET_CURRENT_USER,
          payload: {},
        });
      })
      .catch(error => dispatch(getErrors(error)));
  }
};

// POSTS
// Set loading state
export const setPostLoading = () => ({
  type: actionTypes.POST_LOADING,
});

// Clear Errors
export const clearErrors = () => ({
  type: actionTypes.CLEAR_ERRORS,
});

// Add Post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/posts', postData)
    .then(res => {
      dispatch({
        type: actionTypes.ADD_POST,
        payload: res.data,
      });
    })
    .catch(error => dispatch(getErrors(error)));
};

// Get Posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get('/api/posts')
    .then(res => {
      dispatch({
        type: actionTypes.GET_POSTS,
        payload: res.data,
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.GET_POSTS,
        payload: null,
      })
    );
};

// Get Post
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/post/${id}`)
    .then(res => {
      dispatch({
        type: actionTypes.GET_POST,
        payload: res.data,
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.GET_POST,
        payload: null,
      })
    );
};

// Delete Post
export const deletePost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .delete(`/api/posts/${id}`)
    .then(res => {
      dispatch({
        type: actionTypes.DELETE_POST,
        payload: id,
      });
    })
    .catch(err => dispatch(getErrors(err)));
};

// Add Like
export const addLike = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: actionTypes.GET_POSTS,
        payload: err.response.data,
      })
    );
};

// Remove Like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err => dispatch(getErrors(err)));
};

// Add Comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res => {
      dispatch({
        type: actionTypes.GET_POST,
        payload: res.data,
      });
    })
    .catch(err => dispatch(getErrors(err)));
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res => {
      dispatch({
        type: actionTypes.GET_POST,
        payload: res.data,
      });
    })
    .catch(err => dispatch(getErrors(err)));
};

/***** REDUCERS *****/
// AUTH
const authState = {
  isAuthenticated: false,
  user: {},
};

export const authReducer = (state = authState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };

    default:
      return state;
  }
};

// ERRORS
export const errorReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.GET_ERRORS:
      return action.payload;
    case actionTypes.CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
};

// PROFILE
const profileState = {
  profile: null,
  profiles: null,
  loading: false,
};

export const profileReducer = (state = profileState, action) => {
  switch (action.type) {
    case actionTypes.PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case actionTypes.GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false,
      };
    case actionTypes.CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null,
      };
    default:
      return state;
  }
};

// POST
const initialState = {
  posts: [],
  post: {},
  loading: false,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case actionTypes.GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false,
      };
    case actionTypes.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case actionTypes.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
      };
    default:
      return state;
  }
};
