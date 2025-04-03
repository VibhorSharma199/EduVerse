import React, { useState } from "react";
import {
  Search,
  BookOpen,
  TrendingUp,
  GraduationCap,
  Clock,
  Award,
  Filter,
  ChevronDown,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCircleQuestion,
  faBook,
  faUsers,
  faCog,
  faSignOutAlt,
  faBell,
  faEnvelope,
  faPlay,
  faEllipsisH,
  faTrophy,
  faArrowUpRightDots,
  faBookOpenReader,
  faWebAwesome,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Advanced Web Development",
    description: "Master modern web technologies and frameworks",
    price: 99.99,
    enrolled: true,
    progress: 75,
    category: "Development",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    description: "Learn statistics, Python, and machine learning basics",
    price: 149.99,
    enrolled: true,
    progress: 30,
    category: "Data Science",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "UX/UI Design Principles",
    description: "Create beautiful and functional user interfaces",
    price: 79.99,
    enrolled: false,
    category: "Design",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600",
  },
];

const LearningQuests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Development", "Data Science", "Design"];
  const enrolledCourses = courses.filter((course) => course.enrolled);
  const featuredCourses = courses.filter((course) => course.featured);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen right-0 mr-0 bg-gray-100 text-gray-800 font-inter">
      {/* Sidebar */}
      <Sidebar />
      <div>
        <div className="min-h-screen bg-gray-50">
          {/* Header Dashboard */}
          <div className="bg-indigo-600 text-white py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold mb-6">
                Your Learning Dashboard
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-500 rounded-lg p-4">
                  <div className="flex items-center">
                    <BookOpen className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-sm">Enrolled Courses</p>
                      <p className="text-2xl font-bold">
                        {enrolledCourses.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-500 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-sm">In Progress</p>
                      <p className="text-2xl font-bold">
                        {enrolledCourses.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-500 rounded-lg p-4">
                  <div className="flex items-center">
                    <Award className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-sm">Completed</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Featured Courses */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Featured Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-600 font-bold">
                          ${course.price}
                        </span>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Your Courses */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2" />
                Your Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Progress
                          </span>
                          <span className="text-sm text-gray-600">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* All Courses */}
            <section>
              <h2 className="text-2xl font-bold mb-6">All Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl">{course.title}</h3>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          {course.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-600 font-bold">
                          ${course.price}
                        </span>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                          {course.enrolled ? "Continue Learning" : "Enroll Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
const Sidebar = () => {
  return (
    <div className="w-64 bg-white p-6">
      <div className="flex items-center mb-8">
        <div className="text-purple-600 text-3xl font-bold">C!</div>
        <div className="ml-2 text-xl font-semibold">COURSE</div>
      </div>

      <div className="mb-8">
        <input
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
          placeholder="Search your course here..."
          type="text"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">OVERVIEW</h2>
        <ul>
          <Link to="/">
            <SidebarItem icon={faTachometerAlt} text="Dashboard" />
          </Link>
          <Link to="/quests">
            <SidebarItem
              icon={faCircleQuestion}
              text="Learning Quests"
              active
            />
          </Link>
          <Link to="/quizes">
            <SidebarItem icon={faBook} text="Quizzes and Challenges" />
          </Link>
          <Link to="/badges">
            <SidebarItem icon={faTrophy} text="Badges And Achievement" />
          </Link>
          <Link to="/growth">
            <SidebarItem
              icon={faArrowUpRightDots}
              text="Career Growth Graphs"
            />
          </Link>
          <Link to="/forum">
            <SidebarItem icon={faUsers} text="Discussion Forums" />
          </Link>
          <Link to="/leader">
            <SidebarItem icon={faBookOpenReader} text="Leader Board" />
          </Link>
          <SidebarItem icon={faWebAwesome} text="Chatbot" />
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">FRIENDS</h2>
        <ul>
          <FriendItem
            name="Andrew Meter"
            role="Software Developer"
            imgSrc="https://storage.googleapis.com/a1aa/image/Uvfi4E1H5sZH_zeBWy20ktPIJwvjVPTX2v5UCGSBlmc.jpg"
          />
          <FriendItem
            name="Jeff Linkoln"
            role="Product Owner"
            imgSrc="https://storage.googleapis.com/a1aa/image/vXSsRsaaywWwClXN3DvfIaIp1wPesYN4VD7Ijpoo0fU.jpg"
          />
          <FriendItem
            name="Sasha Melstone"
            role="HR Manager"
            imgSrc="https://storage.googleapis.com/a1aa/image/PpKB9Mt7kmyTFx-bidRpQrbDyi2su1a10HF2DrwqXHs.jpg"
          />
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">SETTINGS</h2>
        <ul>
          <SidebarItem icon={faCog} text="Settings" />
          <SidebarItem icon={faSignOutAlt} text="Logout" logout />
        </ul>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active = false, logout = false }) => {
  return (
    <li
      className={`mb-4 flex items-center ${active ? "text-purple-600" : ""} ${
        logout ? "text-red-600" : ""
      }`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2 w-4" />
      {text}
    </li>
  );
};
const FriendItem = ({ name, role, imgSrc }) => {
  return (
    <li className="flex items-center mb-4">
      <img src={imgSrc} alt={name} className="w-10 h-10 rounded-full mr-2" />
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </li>
  );
};
export default LearningQuests;
