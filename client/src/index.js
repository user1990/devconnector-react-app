import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import registerServiceWorker from './registerServiceWorker';

const App = (
  <BrowserRouter>
    <Route component={AppRouter} />
  </BrowserRouter>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
