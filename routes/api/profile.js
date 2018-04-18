import express from 'express';
import passport from 'passport';

import {
  getCurrentProfile,
  getProfileByHandle,
  getProfileById,
  getAllProfiles,
  createUserProfile,
  addExpierenceToProfile,
  addEducationToProfile,
  deleteExpierenceFromProfile,
  deleteEducationFromProfile,
  deleteUserAndProfile,
} from '../../controllers/profile';

const router = express.Router();

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), getCurrentProfile);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', getProfileByHandle);

// @route   GET api/profile/user/:user
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', getProfileById);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', getAllProfiles);

// @route   POST api/profile
// @desc    Create/Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), createUserProfile);

// @route   POST api/profile/expierence
// @desc    Add expierence to profile
// @access  Private
router.post(
  '/expierence',
  passport.authenticate('jwt', { session: false }),
  addExpierenceToProfile,
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), addEducationToProfile);

// @route   DELETE api/profile/expierence/:exp_id
// @desc    Delete epierence from profile
// @access  Private
router.delete(
  '/expierence/:exp_id',
  passport.authenticate('jwt', { session: false }),
  deleteExpierenceFromProfile,
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  deleteEducationFromProfile,
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), deleteUserAndProfile);

export default router;
