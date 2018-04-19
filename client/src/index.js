import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import {
  setCurrentUser,
  logoutUser,
  clearCurrentProfile,
} from './redux/reducers';
import setAuthToken from './utils/setAuthToken';
import configureStore from './redux/configureStore';
import AppRouter from './routes/AppRouter';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expierence
  const decodedUserData = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decodedUserData));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decodedUserData.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser);
    // Clear current Profile
    store.dispatch(clearCurrentProfile);
    // Redirect to login
    window.location.href = '/login';
  }
}

const App = (
  <Provider store={store}>
    <BrowserRouter>
      <Route component={AppRouter} />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
