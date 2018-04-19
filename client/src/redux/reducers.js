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
// ERROR
const getErrors = err => ({
  type: actionTypes.GET_ERRORS,
  payload: err,
});

// AUTH
// Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => dispatch(getErrors(err.response.data)));
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
    .catch(err => dispatch(getErrors(err.response.data)));
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
    .catch(err => dispatch(getErrors(err.response.data)));
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
      .catch(err => dispatch(getErrors(err.response.data)));
  }
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
export const errorReducer = (errors = {}, action) => {
  switch (action.type) {
    case actionTypes.GET_ERRORS:
      return action.payload;
    case actionTypes.CLEAR_ERRORS:
      return {};
    default:
      return errors;
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
export const postReducer = (post = {}, action) => {
  switch (action.type) {
    default:
      return post;
  }
};
