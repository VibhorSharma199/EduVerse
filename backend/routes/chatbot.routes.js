const express = require("express");
const { protect } = require("../middlewares/auth");
const { getChatbotResponse } = require("../controllers/chatbot.controller");

const router = express.Router();

router.post("/", protect, getChatbotResponse);

module.exports = router;
