const express = require("express");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", asyncHandler(logoutUser));
router.get("/me", protect, asyncHandler(getCurrentUser));

module.exports = router;
