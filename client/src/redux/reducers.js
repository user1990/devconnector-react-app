import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import isEmpty from '../validation/isEmpty';

/***** CONSTANTS *****/
export const actionTypes = {
  GET_ERRORS: 'GET/ERRORS',
  CLEAR_ERRORS: 'CLEAR/ERRORS',

  SET_CURRENT_USER: 'SET/CURRENT_USER',

  GET_PROFILE: 'GET/PROFILE',
  PROFILE_LOADING: 'PROFILE/LOADING',
  PROFILE_NOT_FOUND: 'PROFILE/NOT_FOUND',
  CLEAR_CURRENT_PROFILE: 'CLEAR/CURRENT_PROFILE',
  GET_PROFILES: 'GET/PROFILES',

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

/***** REDUCERS *****/
// AUTH
const initialState = {
  isAuthenticated: false,
  user: {},
};

export const authReducer = (state = initialState, action) => {
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
export const profileReducer = (profile = {}, action) => {
  switch (action.type) {
    default:
      return profile;
  }
};

// POST
export const postReducer = (post = {}, action) => {
  switch (action.type) {
    default:
      return post;
  }
};
