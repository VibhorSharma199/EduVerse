const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get response from chatbot
// @route   POST /api/chatbot
// @access  Private
exports.getChatbotResponse = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorResponse("Please provide a message", 400));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts:
            "You are a helpful educational assistant. Please help me with my learning journey.",
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return next(new ErrorResponse("Failed to get response from chatbot", 500));
  }
});
