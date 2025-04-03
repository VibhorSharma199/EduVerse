import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ManageModules = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddLecture, setShowAddLecture] = useState(null);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    order: 0,
  });
  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    duration: 0,
    order: 0,
  });

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        const [courseResponse, modulesResponse] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/modules`),
        ]);
        setCourse(courseResponse.data);
        setModules(modulesResponse.data);
      } catch (error) {
        setError("Failed to load course and modules");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndModules();
  }, [courseId]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/courses/${courseId}/modules`,
        newModule
      );
      setModules([...modules, response.data]);
      setShowAddModule(false);
      setNewModule({ title: "", description: "", order: modules.length });
    } catch (error) {
      setError("Failed to add module");
      console.error("Error adding module:", error);
    }
  };

  const handleAddLecture = async (moduleId, e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/courses/${courseId}/modules/${moduleId}/lectures`,
        newLecture
      );
      setModules(
        modules.map((module) =>
          module._id === moduleId
            ? { ...module, lectures: [...module.lectures, response.data] }
            : module
        )
      );
      setShowAddLecture(null);
      setNewLecture({
        title: "",
        description: "",
        youtubeUrl: "",
        duration: 0,
        order: 0,
      });
    } catch (error) {
      setError("Failed to add lecture");
      console.error("Error adding lecture:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "module") {
      const reorderedModules = Array.from(modules);
      const [removed] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, removed);

      setModules(reorderedModules);

      try {
        await api.put(`/courses/${courseId}/modules/reorder`, {
          moduleIds: reorderedModules.map((m) => m._id),
        });
      } catch (error) {
        setError("Failed to update module order");
        console.error("Error updating module order:", error);
      }
    } else if (type === "lecture") {
      const moduleId = source.droppableId;
      const module = modules.find((m) => m._id === moduleId);
      const reorderedLectures = Array.from(module.lectures);
      const [removed] = reorderedLectures.splice(source.index, 1);
      reorderedLectures.splice(destination.index, 0, removed);

      setModules(
        modules.map((m) =>
          m._id === moduleId ? { ...m, lectures: reorderedLectures } : m
        )
      );

      try {
        await api.put(
          `/courses/${courseId}/modules/${moduleId}/lectures/reorder`,
          {
            lectureIds: reorderedLectures.map((l) => l._id),
          }
        );
      } catch (error) {
        setError("Failed to update lecture order");
        console.error("Error updating lecture order:", error);
      }
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Modules: {course?.title}
          </h1>
          <p className="text-gray-600 mt-2">{course?.description}</p>
        </div>
        <button
          onClick={() => setShowAddModule(true)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add New Module
        </button>
      </div>

      {showAddModule && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Module</h2>
          <form onSubmit={handleAddModule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows="3"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddModule(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Add Module
              </button>
            </div>
          </form>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules" type="module">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {modules.map((module, moduleIndex) => (
                <Draggable
                  key={module._id}
                  draggableId={module._id}
                  index={moduleIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-4 cursor-move"
                            >
                              ⋮⋮
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {module.title}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {module.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowAddLecture(module._id)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            Add Lecture
                          </button>
                        </div>

                        {showAddLecture === module._id && (
                          <form
                            onSubmit={(e) => handleAddLecture(module._id, e)}
                            className="mb-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={newLecture.title}
                                  onChange={(e) =>
                                    setNewLecture({
                                      ...newLecture,
                                      title: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  value={newLecture.description}
                                  onChange={(e) =>
                                    setNewLecture({
                                      ...newLecture,
                                      description: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                  rows="2"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  YouTube URL
                                </label>
                                <input
                                  type="url"
                                  value={newLecture.youtubeUrl}
                                  onChange={(e) =>
                                    setNewLecture({
                                      ...newLecture,
                                      youtubeUrl: e.target.value,
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Duration (minutes)
                                </label>
                                <input
                                  type="number"
                                  value={newLecture.duration}
                                  onChange={(e) =>
                                    setNewLecture({
                                      ...newLecture,
                                      duration: parseInt(e.target.value),
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                  required
                                />
                              </div>
                              <div className="flex justify-end space-x-4">
                                <button
                                  type="button"
                                  onClick={() => setShowAddLecture(null)}
                                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                                >
                                  Add Lecture
                                </button>
                              </div>
                            </div>
                          </form>
                        )}

                        <Droppable droppableId={module._id} type="lecture">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {module.lectures.map((lecture, lectureIndex) => (
                                <Draggable
                                  key={lecture._id}
                                  draggableId={lecture._id}
                                  index={lectureIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="border rounded-lg p-4 hover:bg-gray-50"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="mr-4 cursor-move"
                                          >
                                            ⋮⋮
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-gray-900">
                                              {lecture.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                              {lecture.description}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {lecture.duration} minutes
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ManageModules;
