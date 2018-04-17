import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import keys from '../config/keys_dev';

export const registerUser = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists',
      });
    }
    const avatar = gravatar.url(req.body.email, {
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm', // Default
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };

        // Sign token
        jwt.sign(payload, keys.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        });
      } else {
        return res.status(404).json({ password: 'Password incorrect' });
      }
    });
  });
};

export const currentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
};
