const express = require("express");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateImage,
  getImages,
  toggleFavorite,
  uploadImage
} = require("../controllers/imageController");

const router = express.Router();

router.use(protect);
router.post("/generate", asyncHandler(generateImage));
router.get("/", asyncHandler(getImages));
router.patch("/favorite/:id", asyncHandler(toggleFavorite));
router.post("/upload", asyncHandler(uploadImage));

module.exports = router;
