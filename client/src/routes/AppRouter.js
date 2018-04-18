import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Landing from '../components/layout/Landing';

// import PrivateRoute from '../routes/PrivateRoute';

import '../styles/App.css';

const App = () => (
  <div className="app">
    <Navbar />
    <Switch>
      <Route exact path="/" component={Landing} />
    </Switch>
    <Footer />
  </div>
);

export default App;
