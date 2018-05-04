import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import keys from './config/keys';
// Routes import
import users from './routes/api/users';
import profile from './routes/api/profile';
import posts from './routes/api/posts';

const express = require('express');

const app = express();

// MongoDb connection
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(keys.MONGO_URI_TEST);
} else {
  mongoose
    .connect(keys.MONGO_URI)
    .then(() => console.log('Mongo DB connected'))
    .catch(err => console.log('MongoDB connect failed', err));
}

// Middleware
if (!process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// Passport configuration
require('./services/passport')(passport);

// Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

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

// Application port
const port = process.env.PORT || 5000;

// Start our server
app.listen(port);
console.log('=================================');
console.log(`Server is running on port ${port}`);
console.log('=================================');
