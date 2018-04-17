import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
// const passport = require('passport');
import bodyParser from 'body-parser';
import db from './config/keys';
// require('./models/User');

import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';

// MongoDb connection
mongoose.Promise = global.Promise;
mongoose
  .connect(db.MONGO_URI)
  .then(() => console.log('Mongo DB connected'))
  .catch(err => console.log(err));

const app = express();

// Middleware
app.use(logger('dev'));
app.use(cors({ credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [keys.COOKIE_Key]
  })
); */
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
