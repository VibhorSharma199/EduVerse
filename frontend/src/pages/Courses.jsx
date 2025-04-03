import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseService from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";
import { FaStar, FaUsers, FaClock, FaBook } from "react-icons/fa";

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    search: "",
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching courses with filters:", filters);
      const response = await courseService.getAllCourses(filters);
      console.log("Raw response:", response);

      // Extract courses from the correct response structure
      if (response && response.data) {
        const coursesData = response.data;
        console.log("Processed courses data:", coursesData);
        setCourses(coursesData);
      } else {
        console.error("Invalid response structure:", response);
        setError("Failed to load courses");
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollCourse(courseId);
      fetchCourses(); // Refresh courses to update enrollment status
    } catch (err) {
      setError(err.message);
    }
  };

  const isEnrolled = (course) => {
    if (!user || !course.enrolledStudents) return false;
    return course.enrolledStudents.some(
      (student) => student._id === user._id || student === user._id
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search courses..."
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Debug Info */}
      <div className="mb-4 text-sm text-gray-500">
        Found {courses.length} courses
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            console.log("Rendering course:", course); // Debug log
            return (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={course.thumbnail || "/default-course.jpg"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/default-course.jpg";
                  }}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {(course.averageRating || 0).toFixed(1)}
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {(course.enrolledStudents || []).length}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {course.duration} min
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ${course.price}
                    </span>
                    {user ? (
                      isEnrolled(course) ? (
                        <Link
                          to={`/courses/${course._id}`}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          Continue Learning
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          Enroll Now
                        </button>
                      )
                    ) : (
                      <Link
                        to="/login"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Login to Enroll
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
