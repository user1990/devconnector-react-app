import express from 'express';
import { userRegister, userLogin } from '../../controllers/users';

const router = express.Router();

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.get('/register', userRegister);

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', userLogin);

export default router;
