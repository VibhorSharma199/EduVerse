import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mentorService from "../services/mentorService";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

export default function CourseManagement() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    duration: 0,
    order: 0,
  });

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [courseResponse, lecturesResponse] = await Promise.all([
        mentorService.getCourseById(courseId),
        mentorService.getCourseLectures(courseId),
      ]);
      setCourse(courseResponse.data);
      setLectures(lecturesResponse.data || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError(error.message || "Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await mentorService.addLecture(courseId, newLecture);
      setShowAddLecture(false);
      setNewLecture({
        title: "",
        description: "",
        youtubeUrl: "",
        duration: 0,
        order: 0,
      });
      fetchCourseData();
    } catch (error) {
      console.error("Error adding lecture:", error);
      setError(error.message || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;
    try {
      setLoading(true);
      setError(null);
      await mentorService.deleteLecture(courseId, lectureId);
      fetchCourseData();
    } catch (error) {
      console.error("Error deleting lecture:", error);
      setError(error.message || "Failed to delete lecture");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
        <Button onClick={() => setShowAddLecture(true)}>Add New Lecture</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddLecture && (
        <Card className="mb-8">
          <Card.Header>
            <Card.Title>Add New Lecture</Card.Title>
          </Card.Header>
          <form onSubmit={handleAddLecture} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                value={newLecture.title}
                onChange={(e) =>
                  setNewLecture({ ...newLecture, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                value={newLecture.description}
                onChange={(e) =>
                  setNewLecture({ ...newLecture, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video URL
              </label>
              <Input
                type="url"
                value={newLecture.youtubeUrl}
                onChange={(e) =>
                  setNewLecture({ ...newLecture, youtubeUrl: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={newLecture.duration}
                onChange={(e) =>
                  setNewLecture({
                    ...newLecture,
                    duration: parseInt(e.target.value),
                  })
                }
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <Input
                type="number"
                value={newLecture.order}
                onChange={(e) =>
                  setNewLecture({
                    ...newLecture,
                    order: parseInt(e.target.value),
                  })
                }
                min="0"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddLecture(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Add Lecture
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {lectures.map((lecture) => (
          <Card key={lecture._id}>
            <Card.Header>
              <div className="flex justify-between items-start">
                <div>
                  <Card.Title>{lecture.title}</Card.Title>
                  <Card.Description>{lecture.description}</Card.Description>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Duration: {lecture.duration} minutes</p>
                    <p>Order: {lecture.order}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteLecture(lecture._id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Header>
          </Card>
        ))}
      </div>

      {lectures.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No lectures found. Add your first lecture!
          </p>
        </div>
      )}
    </div>
  );
}
