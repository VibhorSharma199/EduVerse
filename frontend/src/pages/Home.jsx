import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const LoadingCard = () => (
  <Card className="animate-pulse">
    <div className="relative pb-48 bg-gray-200"></div>
    <Card.Header>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
    </Card.Header>
    <Card.Footer>
      <div className="h-8 bg-gray-200 rounded w-24"></div>
    </Card.Footer>
  </Card>
);

const Home = () => {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await api.get("/courses", {
          params: {
            page: 1,
            limit: 6,
            featured: true,
          },
        });
        // Check if response.data.data exists and is an array
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setFeaturedCourses(response.data.data);
        } else {
          setFeaturedCourses([]);
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        setError("Failed to load featured courses");
        console.error("Error fetching featured courses:", error);
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn New Skills Online
            </h1>
            <p className="text-xl mb-8">
              Access high-quality courses from expert instructors and advance
              your career today.
            </p>
            <Link
              to="/courses"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses && featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={course.mentor.profilePicture}
                        alt={course.mentor.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {course.mentor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.price}
                        </span>
                      )}
                      <span className="text-primary-600 font-medium">
                        $
                        {(course.price * (1 - course.discount / 100)).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="mr-4">⭐ {course.rating.toFixed(1)}</span>
                    <span>{course.totalLectures} lectures</span>
                    <span className="mx-2">•</span>
                    <span>{course.totalDuration} hours</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No featured courses available.</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of students who are already learning on our
              platform.
            </p>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
