import Post from '../models/Post';
import Profile from '../models/Profile';
// Load validation
import validatePostInput from '../validation/post';

export const getPostById = (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ err, nopostfound: 'No post found with that ID' }));
};

export const getAllPosts = (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ err, nopostfound: 'No posts found' }));
};

export const createPost = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  newPost.save().then(post => res.json(post));
};

export const likePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Find liked post
        const { likes } = post;
        const likedPost = likes.filter(like => like.user.toString() === req.user.id);
        if (likedPost.length > 0) {
          return res.status(400).json({ alreadyliked: 'User already liked this post' });
        }

        // Add user id to likes array
        likes.unshift({ user: req.user.id });
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ err, nopostfound: 'No post found' }));
  });
};

export const unlikePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Find liked post
        const { likes } = post;
        const likedPost = likes.filter(like => like.user.toString() === req.user.id);
        if (likedPost.length > 0) {
          return res.status(400).json({ notliked: 'You have not yet liked this post' });
        }

        // Get remove index
        const removeIndex = likes.map(like => like.user.toString()).indexof(req.user.id);
        // Splice out of array
        likes.splice(removeIndex, 1);
        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ err, nopostfound: 'No post found' }));
  });
};

export const addComment = (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };

      // Add to comment array
      post.comments.unshift(newComment);
      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ err, postnotfound: 'No post found' }));
};

export const deletePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }

        // Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ err, nopostfound: 'No post found' }));
  });
};

export const deleteComment = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        // Check to see if comment exists
        const { comments } = post;
        const existingComment = comments.filter(comment => comment._id.toString() === req.params.comment_id);
        if (existingComment.length === 0) {
          return res.status(404).json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = comments
          .map(comment => comment._id.toString())
          .indexof(req.params.comment_id);

        // Splice out of array
        comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ err, nopostfound: 'No post found' }));
  });
};
