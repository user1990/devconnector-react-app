import express from 'express';
import passport from 'passport';

import { registerUser, loginUser, currentUser } from '../../controllers/users';
// import validateRegisterInput from '../../middlewares/register';
// import validateLoginInput from '../../middlewares/login';

const router = express.Router();

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get('/current', passport.authenticate('jwt', { session: false }), currentUser);

export default router;
