const Post = require("../models/post");

// using formidable as a file uploader
const formidable = require("formidable");
const fs = require("fs"); // gives access to file system
const _ = require("lodash");

const mongoose = require("mongoose");

// separating the logic by creating this controller and using it on the route

// gets the posts by OwnerId so that is "tangible"

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("owner", "_id firstName lastName")
    .exec((err, post) => {
      if (err || !post) {
        res.status(400).json({
          error: err
        });
      }
      req.post = post;
      next();
    });
};

// user get all the Posts

exports.getPosts = (req, res, next) => {
  Post.find()
    // getting all the posts by owner
    .populate("owner", "_id firstName lastName")
    // -> If i wanted to get the json response with only these variables
    .select("_id title subtitle description country")
    .then(allThePosts => {
      res.json(allThePosts);
    })
    .catch(err => {
      res.json(err);
    });
};

// user creates the Post

exports.createPost = (req, res, next) => {
  // ability to do storage for files

  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image was not uploaded. Try again please."
      });
    }
    // assign the creation of the post with the owner-> volunteer
    let post = new Post(fields);

    req.profile.hash_password = undefined;
    req.profile.salt = undefined;

    post.owner = req.profile;

    // console.log("profile:", req.profile);

    // for handling files
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path); // this will read the photos path -> Stores the file (1 of the methods from fs)
      post.photo.contentType = files.photo.type; // stores the content type
    }

    // for creating the post if all turns out ok
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
};

// user gets the details of a Post

exports.getDetails = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Post.findById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.json(error);
    });
};

// gets the posts by owner

exports.postsByVolunteer = (req, res, next) => {
  Post.find({
    owner: req.profile._id
  })
    .populate("owner", "_id firstName lastName")
    .sort("_createdAt")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(posts);
    });
};

// Understands who is the owner to commit to such action regarding the post

exports.isOwner = (req, res, next) => {
  let isOwner = req.post && req.auth && req.post.owner._id == req.auth._id;

  console.log("auth:", req.auth);
  console.log("post:", req.post);
  console.log("the id of the owner is: ", req.post.owner._id);

  if (!isOwner) {
    return res.status(403).json({
      error: "You're not the owner of this post!"
    });
  }
  next();
};

// volunteer does the post editing

exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save(err => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json(post);
  });
};

// user deletes the Post

exports.deletePost = (req, res) => {
  let post = req.post;

  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Your post was removed successfully."
    });
  });
};
