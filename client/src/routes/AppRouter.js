import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Landing from '../components/layout/Landing';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import Dashboard from '../components/dashboard/Dashboard';
import CreateProfile from '../components/create-profile/CreateProfile';
import EditProfile from '../components/edit-profile/EditProfile';
import AddExpierence from '../components/add-credentials/AddExpierence';
import AddEducation from '../components/add-credentials/AddEducation';

import PrivateRoute from '../routes/PrivateRoute';

import '../styles/App.css';

const App = () => (
  <div className="app">
    <Navbar />
    <Switch>
      <Route exact path="/" component={Landing} />
      <div className="container">
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/create-profile"
            component={CreateProfile}
          />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        </Switch>
        <Switch>
          <PrivateRoute
            exact
            path="/add-experience"
            component={AddExpierence}
          />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/add-education" component={AddEducation} />
        </Switch>
      </div>
    </Switch>
    <Footer />
  </div>
);

export default App;
