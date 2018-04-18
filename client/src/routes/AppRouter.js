import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Landing from '../components/layout/Landing';

import Register from '../components/auth/Register';
import Login from '../components/auth/Login';

// import PrivateRoute from '../routes/PrivateRoute';

import '../styles/App.css';

const App = () => (
  <div className="app">
    <Navbar />
    <Switch>
      <Route exact path="/" component={Landing} />
      <div className="container">
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </div>
    </Switch>
    <Footer />
  </div>
);

export default App;
