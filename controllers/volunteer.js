const _ = require("lodash");
const Volunteer = require("../models/volunteer-auth");
const formidable = require("formidable");
const fs = require("fs");

exports.volunteerById = (req, res, next, id) => {
  Volunteer.findById(id).exec((err, volunteer) => {
    if (err || !volunteer) {
      return res.status(400).json({
        error: "Volunteer wasn't found!"
      });
    }
    // If it founds him in db, return the profile (json is being used to fetch a specific volunteer)
    req.profile = volunteer;
    next();
  });
};

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "You're not authorized to do this!"
    });
  }
  next();
};

exports.allVolunteers = (req, res) => {
  Volunteer.find((err, volunteers) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    res.json(volunteers);
  }).select("firstName lastName email updated created");
};

exports.getVolunteer = (req, res, next) => {
  req.profile.hash_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// exports.updateVolunteer = (req, res, next) => {
//   let volunteer = req.profile;
//   volunteer = _.extend(volunteer, req.body); // extends will -> Copies every property of the source objects into the first object.
//   volunteer.updated = Date.now();
//   volunteer.save(err => {
//     if (err) {
//       return res.status(400).json({
//         error: "Action not authorized!"
//       });
//     }
//     volunteer.hash_password = undefined;
//     volunteer.salt = undefined;
//     res.json({ volunteer });
//   });
// };

exports.updateVolunteer = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded!"
      });
    }

    //save volunteer and make the changes on the volunteer
    let volunteer = req.profile;
    volunteer = _.extend(volunteer, fields);
    volunteer.updated = Date.now();

    // can also be checked on network. gets us the photo + data
    if (files.photo) {
      volunteer.photo.data = fs.readFileSync(files.photo.path);
      volunteer.photo.contentType = files.photo.type;
    }
    volunteer.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      volunteer.hash_password = undefined;
      volunteer.salt = undefined;
      res.json(volunteer);
    });
  });
};

exports.deleteVolunteer = (req, res, next) => {
  let volunteer = req.profile;
  volunteer.remove((err, volunteer) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    res.json({ message: "Your account was deleted successfully!" });
  });
};

// will load the photo of the user on a separate route to avoid performance outages
exports.vPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};
