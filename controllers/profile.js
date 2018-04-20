import Profile from '../models/Profile';
import User from '../models/User';
// Load validation
import validateProfileInput from '../validation/profile';
import validateExperienceInput from '../validation/experience';
import validateEducationInput from '../validation/education';

export const getCurrentProfile = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};

export const getProfileByHandle = (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('User', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json(err));
};

export const getProfileById = (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.user_id })
    .populate('User', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json({ err, profile: 'There is no profile for this user' }));
};

export const getAllProfiles = (req, res) => {
  const errors = {};

  Profile.find()
    .populate('User', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ err, profile: 'There is no profile for this user' }));
};

export const createUserProfile = (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(404).json(errors);
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
  if (req.body.githubusername) {
    profileFields.githubusername = req.body.githubusername;
  }
  // Skill - Split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.github) profileFields.social.github = req.body.github;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        {
          user: req.user.id,
        },
        {
          $set: profileFields,
        },
        {
          new: true,
        },
      ).then(profile => res.json(profile));
    } else {
      // Create

      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle })
        .populate('User', ['name', 'avatar'])
        .then((profile) => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(404).json(errors);
          }

          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
    }
  });
};

export const addExperienceToProfile = (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then((profile) => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    // Add to experience array
    profile.experience.unshift(newExp);
    profile.save().then(profile => res.json(profile));
  });
};

export const addEducationToProfile = (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  Profile.findOne({ user: req.user.id }).then((profile) => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    // Add to education array
    profile.education.unshift(newEdu);
    profile.save().then(profile => res.json(profile));
  });
};

export const deleteExperienceFromProfile = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      // Get remove index
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

      if (removeIndex > -1) {
        // Splice out of array
        profile.experience.splice(removeIndex, 1);
      }

      if (removeIndex === -1) {
        return res.status(404).json({
          error: 'There is no experience with this ID',
        });
      }
      // Save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
};

export const deleteEducationFromProfile = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      // Get remove index
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

      if (removeIndex > -1) {
        // Splice out of array
        profile.education.splice(removeIndex, 1);
      }

      if (removeIndex === -1) {
        return res.status(404).json({
          error: 'There is no experience with this ID',
        });
      }
      // Save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
};

export const deleteUserAndProfile = (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }));
  });
};
