const express = require("express");
const { getProfile, updateProfile, getAllUsers, deleteUser } = require("../controllers/userProfile");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route("/")
  .get(protect, authorize("admin"), getAllUsers);

router.route("/:id")
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;