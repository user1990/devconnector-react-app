import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
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
// AUTH
// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
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
      setAuthToken(token);
      // Decode token to get user data
      const decodedUserData = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decodedUserData));
    })
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
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
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
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
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post('/api/profile/education', eduData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
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
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
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
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
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
      .catch(err =>
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data,
        })
      );
  }
};

// POSTS
// Set loading state
export const setPostLoading = () => ({
  type: actionTypes.POST_LOADING,
});

// Add Post
export const addPost = postData => dispatch => {
  axios
    .post('/api/posts', postData)
    .then(res => {
      dispatch({
        type: actionTypes.ADD_POST,
        payload: res.data,
      });
    })
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Add Post
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

// Delete Post
export const deletePost = () => dispatch => {
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

// Add Like
export const addLike = () => dispatch => {
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

// Remove Like
export const removeLike = () => dispatch => {
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
    case actionTypes.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    default:
      return state;
  }
};
