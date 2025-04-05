import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCjsKucIT7iuVxF3n247rbySb4tTuwwGFM");

class GeminiService {
  async generateQuizExplanation(question, answer) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Please explain the following question and its answer in a clear and educational way:
      Question: ${question}
      Answer: ${answer}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating quiz explanation:", error);
      throw new Error("Failed to generate quiz explanation");
    }
  }

  async chatWithAI(message) {
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
      return response.text();
    } catch (error) {
      console.error("Error chatting with AI:", error);
      throw new Error("Failed to get response from AI");
    }
  }
}

export default new GeminiService();
