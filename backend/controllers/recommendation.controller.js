import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Get personalized recommendations based on student's skills
export const getRecommendations = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get all published courses
    const courses = await Course.find({ status: "published" })
      .populate("mentor", "name skills bio")
      .populate("modules");

    // Calculate course relevance scores based on student's skills
    const recommendations = courses.map((course) => {
      // Calculate skill match score
      const studentSkills = new Set(
        student.skills.map((skill) => skill.toLowerCase())
      );
      const courseSkills = new Set([
        ...course.tags.map((tag) => tag.toLowerCase()),
        course.category.toLowerCase(),
        course.level.toLowerCase(),
      ]);

      const matchingSkills = [...studentSkills].filter((skill) =>
        courseSkills.has(skill)
      );
      const skillMatchScore =
        matchingSkills.length / Math.max(studentSkills.size, courseSkills.size);

      // Calculate mentor match score
      const mentorSkills = new Set(
        course.mentor.skills.map((skill) => skill.toLowerCase())
      );
      const mentorMatchScore =
        matchingSkills.length / Math.max(studentSkills.size, mentorSkills.size);

      // Calculate overall relevance score
      const relevanceScore = skillMatchScore * 0.7 + mentorMatchScore * 0.3;

      return {
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          category: course.category,
          level: course.level,
          price: course.price,
          rating: course.rating,
          totalDuration: course.totalDuration,
          totalLectures: course.totalLectures,
        },
        mentor: {
          id: course.mentor._id,
          name: course.mentor.name,
          bio: course.mentor.bio,
        },
        relevanceScore,
        matchingSkills,
      };
    });

    const sortedRecommendations = recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: sortedRecommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting recommendations",
      error: error.message,
    });
  }
};
