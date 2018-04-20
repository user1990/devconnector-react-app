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
import AddExperience from '../components/add-credentials/AddExperience';
import AddEducation from '../components/add-credentials/AddEducation';
import Profiles from '../components/profiles/Profiles';
import Profile from '../components/profile/Profile';
import NotFound from '../components/not-found/NotFound';

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
        <Route exact path="/profiles" component={Profiles} />
        <Route exact path="/profile/:handle" component={Profile} />
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
            component={AddExperience}
          />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/add-education" component={AddEducation} />
        </Switch>
        <Route exact path="*" component={NotFound} />
      </div>
    </Switch>
    <Footer />
  </div>
);

export default App;
