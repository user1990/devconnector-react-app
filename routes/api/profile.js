import express from 'express';
import passport from 'passport';

import { getCurrentProfile, createUserProfile } from '../../controllers/profile';

const router = express.Router();

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), getCurrentProfile);

// @route   POST api/profile
// @desc    Create/Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createUserProfile);

export default router;
