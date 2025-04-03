import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseService from "../services/courseService";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    search: "",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses(filters);
      console.log("API Response:", response); // Debug log
      setCourses(response.data || []);
      setPagination({
        total: response.total || 0,
        pages: response.pages || 1,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      page: 1, // Reset to first page when search changes
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Search courses..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="relative pb-48">
                  <img
                    className="absolute h-full w-full object-cover"
                    src={course.thumbnail}
                    alt={course.title}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-medium text-indigo-600">
                      ${course.price}
                    </span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        filters.page === page
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
