import express from 'express';
import passport from 'passport';

import {
  getPostById,
  getAllPosts,
  createPost,
  likePost,
  unlikePost,
  addComment,
  deletePost,
  deleteComment,
} from '../../controllers/posts';

const router = express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', getAllPosts);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', getPostById);

// @route   POST api/posts
// @desc    Create a posts
// @access  Private
router.post('/', passportJWT, createPost);

// @route   POST api/posts/like::id
// @desc    Like a post
// @access  Private
router.post('/like/:id', passportJWT, likePost);

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post('/unlike/:id', passportJWT, unlikePost);

// @route   POST api/posts/comment/:id
// @desc    Add a comment to post
// @access  Private
router.post('/comment/:id', passportJWT, addComment);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', passportJWT, deletePost);

// @route   DELETE api/posts/comment:id/comment_id
// @desc    Remove a comment from post
// @access  Private
router.delete('/comment/:id/:commentId', passportJWT, deleteComment);

export default router;
