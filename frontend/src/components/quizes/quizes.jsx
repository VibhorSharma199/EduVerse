import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCircleQuestion,
  faBook,
  faUsers,
  faCog,
  faSignOutAlt,
  faTrophy,
  faArrowUpRightDots,
  faBookOpenReader,
  faWebAwesome,
  faPlay,
  faEllipsisH,
  faPlusCircle,
  faEye,
  faEdit,
  faChartPie,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import quizService from "../../services/quizService";

const Quizes = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await quizService.getAllQuizzes(); // Adjusted to fetch quizzes from API
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleQuizSubmit = async (quizId, answers) => {
    try {
      const response = await quizService.submitQuiz(quizId, { answers }); // API expects answers in this format
      alert(`Quiz submitted! Your score: ${response.data.score}`);
      setQuizResults(response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz.");
    }
  };

  const handleViewResults = async (quizId) => {
    try {
      const response = await quizService.getQuizResults(quizId); // Fetch results from API
      setQuizResults(response.data);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      alert("Failed to fetch quiz results.");
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Quiz Results */}
      {quizResults && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-green-200">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            Quiz Results
          </h2>
          <p>Score: {quizResults.score}</p>
          <p>Passing Score: {quizResults.passingScore}</p>
          <p>Attempts: {quizResults.attempts.length}</p>
        </div>
      )}

      {/* My Quizzes Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">My Quizzes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{quiz.title}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleQuizSubmit(quiz.id, [])}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Submit Quiz
                    </button>
                    <button
                      onClick={() => handleViewResults(quiz.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quizes;
