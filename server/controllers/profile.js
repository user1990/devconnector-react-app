import Profile from '../models/Profile';
import User from '../models/User';
// Load validation
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';

export const getCurrentProfile = async (req, res) => {
  try {
    const errors = {};

    const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (profile) {
      return res.json(profile);
    }

    errors.noprofile = 'There is no profile for this user';

    return res.status(404).json(errors);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const getProfileByHandle = async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      handle: req.params.handle,
    }).populate('user', ['name', 'avatar']);

    if (profile) {
      return res.json(profile);
    }

    errors.noprofile = 'There is no profile for this user';

    return res.status(404).json(errors);
  } catch (err) {
    errors.noprofile = 'There is no profile for this user';
    return res.status(404).json(errors);
  }
};

export const getProfileById = async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate('user', ['name', 'avatar']);

    if (profile) {
      return res.json(profile);
    }

    errors.noprofile = 'There is no profile for this user';

    return res.status(404).json(errors);
  } catch (err) {
    errors.noprofile = 'There is no profile for this user';
    return res.status(404).json(errors);
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const errors = {};
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (profiles) {
      return res.json(profiles);
    }

    errors.noprofile = 'There are no profiles';

    return res.status(404).json(errors);
  } catch (err) {
    return res.status(404).json(err);
  }
};

export const createUserProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',').map(skill => skill.trim());
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }

    // Create new profile
    // Check if handle exists
    profile = await Profile.findOne({ handle: profileFields.handle });
    if (profile) {
      errors.handle = 'Handle already exists';
      return res.status(400).json(errors);
    }

    profile = await new Profile(profileFields).save();
    return res.json(profile);
  } catch (error) {
    throw error;
  }
};

export const addExperienceToProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(404).json(errors);
    }

    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    const newExperience = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      descripton: req.body.descripton,
    };

    // Add to experience array
    profile.experience.unshift(newExperience);

    profile = await profile.save();
    return res.json(profile);
  } catch (error) {
    throw error;
  }
};

export const addEducationToProfile = async (req, res) => {
  try {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    const newEducation = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      descripton: req.body.descripton,
    };

    // Add to experience array
    profile.education.unshift(newEducation);

    profile = await profile.save();
    return res.json(profile);
  } catch (error) {
    throw error;
  }
};

export const deleteExperienceFromProfile = async (req, res) => {
  const errors = {};

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    // Update experience array
    const updatedExperience = profile.experience.filter(({ id }) => id !== req.params.id);

    profile.experience = updatedExperience;
    profile = await profile.save();

    return res.json(profile);
  } catch (error) {
    throw error;
  }
};

export const deleteEducationFromProfile = async (req, res) => {
  const errors = {};

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    // Update education array
    const updatedEducation = profile.education.filter(({ id }) => id !== req.params.id);

    profile.education = updatedEducation;
    profile = await profile.save();

    return res.json(profile);
  } catch (err) {
    throw err;
  }
};

export const deleteUserAndProfile = async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ success: true });
  } catch (error) {
    throw error;
  }
};
