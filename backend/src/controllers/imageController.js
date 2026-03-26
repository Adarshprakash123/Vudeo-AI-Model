const Image = require("../models/Image");

const aspectMap = {
  "1:1": "900/900",
  "16:9": "1280/720",
  "9:16": "720/1280",
  "4:5": "800/1000"
};

const generateImage = async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const size = aspectMap[aspectRatio] || aspectMap["1:1"];
  const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}`;

  const image = await Image.create({
    userId: req.user._id,
    prompt: prompt.trim(),
    imageUrl,
    aspectRatio,
    source: "generated"
  });

  return res.status(201).json({
    message: "Image generated successfully",
    image
  });
};

const getImages = async (req, res) => {
  const images = await Image.find({ userId: req.user._id }).sort({ createdAt: -1 });

  return res.status(200).json({ images });
};

const toggleFavorite = async (req, res) => {
  const image = await Image.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  image.isFavorite = !image.isFavorite;
  await image.save();

  return res.status(200).json({
    message: "Favorite updated",
    image
  });
};

const uploadImage = async (req, res) => {
  const { imageUrl, prompt = "Uploaded media" } = req.body;

  const fallbackSeed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const safeImageUrl = imageUrl || `https://picsum.photos/seed/upload-${fallbackSeed}/900/900`;

  const image = await Image.create({
    userId: req.user._id,
    prompt,
    imageUrl: safeImageUrl,
    source: "uploaded"
  });

  return res.status(201).json({
    message: "Mock upload saved successfully",
    image
  });
};

module.exports = {
  generateImage,
  getImages,
  toggleFavorite,
  uploadImage
};
