import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Upload course thumbnail
router.post("/thumbnail", protect, upload.single("thumbnail"), (req, res) => {
  res.json({ url: req.file.path });
});

// Upload course video
router.post("/video", protect, upload.single("video"), (req, res) => {
  res.json({ url: req.file.path });
});

export default router;
