import mongoose from "mongoose";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const sampleCourses = [
  {
    title: "Web Development Fundamentals",
    description:
      "Learn the basics of web development with HTML, CSS, and JavaScript",
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630be2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "programming",
    level: "beginner",
    price: 49.99,
    isFeatured: true,
    status: "published",
    rating: 4.5,
    totalDuration: 120,
    totalLectures: 24,
  },
  {
    title: "Digital Marketing Mastery",
    description:
      "Master the art of digital marketing with this comprehensive course",
    thumbnail:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "marketing",
    level: "intermediate",
    price: 79.99,
    isFeatured: true,
    status: "published",
    rating: 4.8,
    totalDuration: 180,
    totalLectures: 36,
  },
  {
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and experience design",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "design",
    level: "beginner",
    price: 59.99,
    isFeatured: true,
    status: "published",
    rating: 4.6,
    totalDuration: 150,
    totalLectures: 30,
  },
  {
    title: "Business Strategy & Growth",
    description: "Develop effective business strategies for sustainable growth",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    category: "business",
    level: "advanced",
    price: 89.99,
    isFeatured: true,
    status: "published",
    rating: 4.7,
    totalDuration: 200,
    totalLectures: 40,
  },
];

const seedCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find a mentor user
    const mentor = await User.findOne({ role: "mentor" });
    if (!mentor) {
      console.log("No mentor found. Please create a mentor user first.");
      process.exit(1);
    }

    // Clear existing courses
    await Course.deleteMany({});
    console.log("Cleared existing courses");

    // Add mentor ID to each course
    const coursesWithMentor = sampleCourses.map((course) => ({
      ...course,
      mentor: mentor._id,
    }));

    // Insert new courses
    const courses = await Course.insertMany(coursesWithMentor);
    console.log(`Successfully seeded ${courses.length} courses`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
