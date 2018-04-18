import { combineReducers } from 'redux';
import {
  authReducer,
  errorReducer,
  profileReducer,
  postReducer,
} from './reducers';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer,
});
