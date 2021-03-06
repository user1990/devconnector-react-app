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
export const getErrors = error => ({
  type: actionTypes.GET_ERRORS,
  payload: error.response.data,
});

// AUTH
// Register user
export const registerUser = (userCredentials, history) => async dispatch => {
  try {
    await axios.post('/api/users/register', userCredentials);
    history.push('/login');
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Set Logged in user
export const setCurrentUser = decodedUserCredentials => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: decodedUserCredentials,
});

// Login - Get User Token
export const loginUser = userCredentials => async dispatch => {
  try {
    const response = await axios.post('/api/users/login', userCredentials);
    const { token } = response.data;

    // Set token in localStorage
    localStorage.setItem('jwtToken', token);

    // Set token to Auth header
    setAuthorizationHeader(token);

    // Decode token to get user credentials
    const decodedUserCredentials = jwt_decode(token);

    // Set current user
    dispatch(setCurrentUser(decodedUserCredentials));
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');

  // Remove auth header for future requests
  setAuthorizationHeader(false);

  // Set current user to {} which will set isAuthenticated = false
  dispatch(setCurrentUser({}));
};

// PROFILE
// Profile loading
export const setProfileLoading = () => ({
  type: actionTypes.PROFILE_LOADING,
});

// Get current profile
export const getCurrentProfile = () => async dispatch => {
  try {
    dispatch(setProfileLoading());
    const response = await axios.get('/api/profile');
    dispatch({ type: actionTypes.GET_PROFILE, payload: response.data });
  } catch (error) {
    // dispatch(getErrors(error));
    dispatch({ type: actionTypes.GET_PROFILE, payload: {} });
  }
};

// Get current profile by handle
export const getProfileByHandle = handle => async dispatch => {
  try {
    dispatch(setProfileLoading());

    const response = await axios.get(`/api/profile/handle/${handle}`);
    dispatch({ type: actionTypes.GET_PROFILE, payload: response.data });
  } catch (error) {
    // dispatch({ type: GET_ERRORS, payload: error.response.data })
    dispatch({ type: actionTypes.GET_PROFILE, payload: null });
  }
};

// Get all profiles
export const getProfiles = () => async dispatch => {
  try {
    dispatch(setProfileLoading());
    const response = await axios.get('/api/profile/all');
    dispatch({ type: actionTypes.GET_PROFILES, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.GET_PROFILES, payload: {} });
  }
};

// Create Profile
export const createProfile = (profileData, history) => async dispatch => {
  try {
    await axios.post('/api/profile', profileData);
    history.push('/dashboard');
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Clear profile
export const clearCurrentProfile = () => ({
  type: actionTypes.CLEAR_CURRENT_PROFILE,
});

// Add experience
export const addExperience = (experienceData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/experience', experienceData);
    history.push('/dashboard');
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Add education
export const addEducation = (educationData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/education', educationData);
    history.push('/dashboard');
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({ type: actionTypes.GET_PROFILE, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/education/${id}`);
    dispatch({ type: actionTypes.GET_PROFILE, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Delete account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');
      dispatch({ type: actionTypes.SET_CURRENT_USER, payload: {} });
    } catch (error) {
      dispatch(getErrors(error));
    }
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
export const addPost = postData => async dispatch => {
  dispatch(clearErrors());
  try {
    const response = await axios.post('/api/posts', postData);
    dispatch({ type: actionTypes.ADD_POST, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Get all Posts
export const getPosts = () => async dispatch => {
  dispatch(clearErrors());
  try {
    dispatch(setPostLoading());
    const response = await axios.get('/api/posts');
    dispatch({ type: actionTypes.GET_POSTS, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.GET_POSTS, payload: null });
  }
};

// Get Post by ID
export const getPost = id => async dispatch => {
  try {
    const response = await axios.get(`/api/posts/${id}`);
    dispatch({ type: actionTypes.GET_POST, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.GET_POST, payload: null });
  }
};

// Delete Post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);
    dispatch({ type: actionTypes.DELETE_POST, payload: id });
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Add Like
export const addLike = id => async dispatch => {
  try {
    await axios.post(`/api/posts/like/${id}`);
    dispatch(getPosts());
  } catch (error) {
    dispatch(getErrors());
  }
};

// Remove Like
export const removeLike = id => async dispatch => {
  try {
    await axios.post(`/api/posts/unlike/${id}`);
    dispatch(getPosts());
  } catch (error) {
    dispatch(getErrors());
  }
};

// Add Comment
export const addComment = (postId, commentData) => async dispatch => {
  dispatch(clearErrors());
  try {
    const response = await axios.post(
      `/api/posts/comment/${postId}`,
      commentData
    );
    dispatch({ type: actionTypes.GET_POST, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error));
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
  dispatch(clearErrors());
  try {
    const response = await axios.delete(
      `/api/posts/comment/${postId}/${commentId}`
    );
    dispatch({ type: actionTypes.GET_POST, payload: response.data });
  } catch (error) {
    dispatch(getErrors(error));
  }
};

/***** REDUCERS *****/
// AUTH
const initialAuthState = {
  isAuthenticated: false,
  user: {},
};

export const authReducer = (state = initialAuthState, action) => {
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
const initialErrorState = {};

export const errorReducer = (state = initialErrorState, action) => {
  switch (action.type) {
    case actionTypes.GET_ERRORS:
      return action.payload;
    case actionTypes.CLEAR_ERRORS:
      return initialErrorState;
    default:
      return state;
  }
};

// PROFILE
const initialProfileState = {
  profile: null,
  profiles: null,
  loading: false,
};

export const profileReducer = (state = initialProfileState, action) => {
  switch (action.type) {
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
    case actionTypes.PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

// POST
const initialPostState = {
  posts: [],
  post: {},
  loading: false,
};

export const postReducer = (state = initialPostState, action) => {
  switch (action.type) {
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
    case actionTypes.POST_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
