import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import gamificationService from "../services/gamificationService";
import { FaCheckCircle, FaTrophy, FaMedal } from "react-icons/fa";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionResult, setCompletionResult] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.data);
      setProgress(response.data.data.progress || 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleMarkCompleted = async () => {
    try {
      // First mark the course as completed
      const result = await gamificationService.markCourseCompleted(id);
      console.log("Mark completed result:", result);

      // Then check for badges
      const badgeResult = await gamificationService.checkCourseCompletion(id);
      console.log("Badge check result:", badgeResult);

      // Combine the results
      setCompletionResult({
        ...result,
        badges: badgeResult.badges || [],
        achievements: badgeResult.achievements || [],
      });

      setShowCompletionModal(true);
      setProgress(100);
      fetchCourse();
    } catch (error) {
      console.error("Error in handleMarkCompleted:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-1" />
            <span>{progress}% Complete</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
            <p className="text-gray-600 mb-6">{course.description}</p>

            <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
            <ul className="space-y-2">
              {course.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
            </div>

            {progress < 100 && (
              <button
                onClick={handleMarkCompleted}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && completionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Congratulations!</h3>
            <p className="mb-4">You've completed the course!</p>

            {completionResult.badges.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">New Badges Earned:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {completionResult.badges.map((badge) => (
                    <div key={badge._id} className="flex items-center">
                      <FaMedal className="text-yellow-500 text-2xl mr-2" />
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completionResult.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">New Achievements:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {completionResult.achievements.map((achievement) => (
                    <div key={achievement._id} className="flex items-center">
                      <FaTrophy className="text-yellow-500 text-2xl mr-2" />
                      <span>{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
