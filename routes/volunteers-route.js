const express = require("express");

const {
  volunteerById,
  allVolunteers,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
  hasAuthorization
} = require("../controllers/volunteer");

// call the requireLogin to only authorize logged in users to see a specific volunteer
const { requireLogin } = require("../controllers/auth");

const router = express.Router();

// get all the volunteers that exist on the app. Doesn't need authentication. Or should i add?

router.get("/volunteers", allVolunteers);

// get the specific volunteer. However, safety reason, you need to be an authenticated volunteer to see a specific volunteer

router.get("/volunteer/:volunteerId", requireLogin, getVolunteer);

// updates the volunteer profile -> only done if logged in and will be the same user doing the update (obviously)

router.put(
  "/volunteer/:volunteerId",
  requireLogin,
  hasAuthorization,
  updateVolunteer
);

// will remove the volunteers profile (thus, the volunteer)
router.delete(
  "/volunteer/:volunteerId",
  requireLogin,
  hasAuthorization,
  deleteVolunteer
);

// app will execute volunteerByID 1st for any route containing the :volunteerId
router.param("volunteerId", volunteerById);

module.exports = router;
