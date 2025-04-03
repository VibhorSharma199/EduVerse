import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateQuizQuestions(topic, difficulty, count = 5) {
    try {
      const prompt = `Generate ${count} quiz questions about ${topic} with difficulty level ${difficulty}. 
      Format each question as a JSON object with the following structure:
      {
        "question": "The question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "The correct option",
        "explanation": "Explanation of the correct answer"
      }
      Return an array of these objects.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating quiz questions:", error);
      throw new Error("Failed to generate quiz questions");
    }
  }

  async generateCourseContent(topic, level) {
    try {
      const prompt = `Generate a course outline for ${topic} at ${level} level. 
      Include:
      1. Course objectives
      2. Module structure
      3. Key concepts to cover
      4. Learning outcomes
      Format as JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating course content:", error);
      throw new Error("Failed to generate course content");
    }
  }

  async generateFeedback(studentResponse, correctAnswer) {
    try {
      const prompt = `Analyze this student's response: "${studentResponse}"
      Compare it with the correct answer: "${correctAnswer}"
      Provide constructive feedback in JSON format with:
      {
        "score": number between 0 and 100,
        "feedback": "Detailed feedback",
        "suggestions": ["Suggestion 1", "Suggestion 2"]
      }`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating feedback:", error);
      throw new Error("Failed to generate feedback");
    }
  }

  async generatePersonalizedLearningPath(userProfile) {
    try {
      const prompt = `Based on this user profile: ${JSON.stringify(userProfile)}
      Generate a personalized learning path in JSON format with:
      {
        "recommendedCourses": ["Course 1", "Course 2"],
        "learningGoals": ["Goal 1", "Goal 2"],
        "estimatedTimeline": "Timeline description",
        "prerequisites": ["Prerequisite 1", "Prerequisite 2"]
      }`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating learning path:", error);
      throw new Error("Failed to generate learning path");
    }
  }

  async generateCertificateContent(
    userName,
    courseName,
    grade,
    completionDate
  ) {
    try {
      const prompt = `Generate certificate content for:
      Student: ${userName}
      Course: ${courseName}
      Grade: ${grade}
      Completion Date: ${completionDate}
      
      Format as JSON with:
      {
        "certificateText": "Main certificate text",
        "signatureLine": "Signature line text",
        "additionalInfo": "Any additional information"
      }`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating certificate content:", error);
      throw new Error("Failed to generate certificate content");
    }
  }
}

const aiService = new AIService();
export default aiService;
