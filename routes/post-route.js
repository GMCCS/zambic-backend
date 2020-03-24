const express = require("express");

// routes for volunteer actions on posts
// destructure for easier association
const {
  getPosts,
  createPost,
  postsByVolunteer,
  postById,
  isOwner,
  updatePost,
  deletePost,
  getDetails,
  photo
} = require("../controllers/post");

// authorization

const { requireLogin } = require("../controllers/auth");

// Id to fetch volunteer

const { volunteerById } = require("../controllers/volunteer");

// Post validators

const { createPostValidator } = require("../validator/validator");

const router = express.Router();

// -------------------------------------------------------

// GET route => to get all the posts from volunteers
// if i had the requireLogin, it will only allow me to see the feed if i am authenticated, which not ideal as it should be "free"
router.get("/posts", getPosts);

// POST route => to create a new post

router.post(
  "/post/create/:volunteerId",
  requireLogin,
  createPost,
  createPostValidator
);

// a logged in user is able to get posts by volunteer

router.get("/posts/by/:volunteerId", requireLogin, postsByVolunteer);

// PUT route => to update a specific post

router.put("/post/:postId", requireLogin, isOwner, updatePost);

// DELETE route => to delete a specific post, by the specific owner of the post

router.delete("/post/:postId", requireLogin, isOwner, deletePost);

// GET route => to get the details out of a post - Also, should be free ... or... might be a nice idea to get signups?
// let's go with this idea for the beginning. Any details will need login before someone can actually check them

router.get("/post/:postId", getDetails);

// post photo
router.get("/post/photo/:postId", photo);

// app will execute volunteerByID 1st for any route containing the :volunteerId
router.param("volunteerId", volunteerById);

// any route containing the :postId will be executed first
router.param("postId", postById);

module.exports = router;
