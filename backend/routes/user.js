const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { updateProfile } = require("../controllers/userController");

// Protected route
router.put("/update-profile", protect, updateProfile);

module.exports = router;
