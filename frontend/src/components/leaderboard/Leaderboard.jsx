import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
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

const initialStudents = [
  { username: "JohnDoe", points: 950, badges: ["🏆", "🎯"], progress: 85 },
  { username: "JaneSmith", points: 1200, badges: ["🌟", "🔥"], progress: 95 },
  { username: "AlexBrown", points: 780, badges: ["📚", "🎖️"], progress: 60 },
  { username: "EmmaWilson", points: 1100, badges: ["🚀", "🎯"], progress: 90 },
  { username: "MikeJohnson", points: 640, badges: ["🎖️", "🌟"], progress: 50 },
];

const LeaderBoard = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("points");

  const filteredStudents = students
    .filter((student) =>
      student.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      filter === "points"
        ? b.points - a.points
        : a.username.localeCompare(b.username)
    );

  const topStudents = [...students]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const data = {
    labels: topStudents.map((student) => student.username),
    datasets: [
      {
        label: "Points",
        data: topStudents.map((student) => student.points),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen right-0 mr-0 bg-gray-50 text-gray-800 font-inter">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1">
        <div className="p-6 mx-auto">
          <h1 className="text-2xl font-bold mb-4">Student Leaderboard</h1>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by username..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="points">Sort by Points</option>
              <option value="username">Sort by Username</option>
            </select>
          </div>

          <div className="flex flex-row gap-8">
            <div className="flex-1">
              {filteredStudents.map((student, index) => (
                <div
                  key={student.username}
                  className={`rounded-lg p-4 mb-4 shadow-md border ${index < 3 ? "border-yellow-400" : "border-gray-300"}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xl font-bold ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-500" : "text-orange-400"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-lg font-semibold">
                        {student.username}
                      </span>
                      <div>
                        {student.badges.map((badge, i) => (
                          <span key={i} className="ml-1">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {student.points} pts
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Top 5 Students</h2>
              <Bar data={data} />
            </div>
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
            <SidebarItem icon={faCircleQuestion} text="Learning Quests" />
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
            <SidebarItem icon={faBookOpenReader} text="Leader Board" active />
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
export default LeaderBoard;
