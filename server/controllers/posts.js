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

export const createPost = async (req, res) => {
  try {
    // Validate input
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const postFields = {};
    postFields.user = req.user.id;
    postFields.avatar = req.body.avatar;
    postFields.name = req.body.name;
    postFields.text = req.body.text;

    // Create new profile
    const newPost = await new Post(postFields).save();
    return res.json(newPost);
  } catch (err) {
    throw err;
  }
};

export const likePost = async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'No profile found';
      return res.status(404).json(errors);
    }

    let post = await Post.findById(req.params.id);
    if (!post) {
      errors.nopost = `No post found for ${req.params.id}`;
      return res.status(404).json(errors);
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id)
        .length > 0
    ) {
      errors.alreadyLiked = 'User already liked this post';
      return res.status(400).json(errors);
    }

    // Add user id to likes array
    post.likes.unshift({ user: req.user.id });

    // Save the post
    post = await post.save();

    return res.json(post);
  } catch (err) {
    errors.nopost = `No post found for ${req.params.id}`;
    return res.status(404).json(errors);
  }
};

export const unlikePost = async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'No profile found';
      return res.status(404).json(errors);
    }

    let post = await Post.findById(req.params.id);
    if (!post) {
      errors.nopost = `No post found for ${req.params.id}`;
      return res.status(404).json(errors);
    }

    if (
      post.likes.filter(like => like.user.toString() === req.user.id)
        .length === 0
    ) {
      errors.notLiked = 'You have not yest liked this post';
      return res.status(400).json(errors);
    }

    // Remove user id from likes array
    const updatedLikes = post.likes.filter(like => like.user.toString() !== req.user.id);
    post.likes = updatedLikes;

    // Save the post
    post = await post.save();

    return res.json(post);
  } catch (err) {
    errors.nopost = `No post found for ${req.params.id}`;
    return res.status(404).json(errors);
  }
};

export const addComment = async (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      errors.nopost = `No post found for ${req.params.id}`;
      return res.status(404).json(errors);
    }

    // Add comment to comments array
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    // Save the post
    post = await post.save();

    return res.json(post);
  } catch (err) {
    errors.nopost = `No post found for ${req.params.id}`;
    return res.status(404).json(errors);
  }
};

export const deletePost = async (req, res) => {
  let errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'No profile found';
      return res.status(404).json(errors);
    }

    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) {
      errors.nopost = `No post found for ${req.params.id}`;
      return res.status(404).json(errors);
    }

    // Check for post owner
    if (post.user.toString() !== req.user.id) {
      errors = { notauthorized: 'User no authorized' };
      return res.status(401).json(errors);
    }

    // Delete the post
    await post.remove();

    return res.json({ success: true });
  } catch (err) {
    errors.nopost = `No post found for ${req.params.id}`;
    return res.status(404).json(errors);
  }
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
        return post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ err, nopostfound: 'No post found' }));
  });
};
