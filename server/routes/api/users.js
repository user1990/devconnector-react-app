import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, currentUser } from '../../controllers/users';

const router = express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get('/current', passportJWT, currentUser);

export default router;
