import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt,faCircleQuestion, faBook, faUsers, 
  faCog, faSignOutAlt, faBell, faEnvelope, faPlay, faEllipsisH, 
  faTrophy,
  faArrowUpRightDots,
  faBookOpenReader,
  faWebAwesome
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import MentorDashboard from './mentorDashboard/MentorDashboard';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen right-0 mr-0 bg-gray-100 text-gray-800 font-inter">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6 right-0 mr-0">
        {/* Top Section - Banner and Stats */}
        <div className="flex flex-col lg:flex-row justify-between mb-6 gap-6">
          <div className="flex-1">
            <div className="bg-purple-100 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-4">
                <h2 className="text-2xl font-semibold mb-2">
                  Sharpen Your Skills With Professional Online Courses
                </h2>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Join Now
                </button>
              </div>
              <img 
                alt="Online Course" 
                className="w-32 h-32 object-contain" 
                src="https://storage.googleapis.com/a1aa/image/VR8lXtOe_0ztHzT2CCkbNLJkobKP93hu_Z6ktp377F0.jpg" 
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <StatsCard value="8/15 Watched" label="Front-end" />
              <StatsCard value="3/14 Watched" label="Back-end" />
              <StatsCard value="2/6 Watched" label="Product Design" />
              <StatsCard value="9/10 Watched" label="Project Manager" />
            </div>
          </div>
          
          {/* Profile Card on the right */}
          <div className="w-full lg:w-64 mr-0">
            <ProfileCard />
          </div>
        </div>

        {/* Middle Section - Continue Watching and Mentor List */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Continue Watching - Takes more space */}
          <div className="flex-1 lg:flex-[2]">
            <ContinueWatchingSection />
          </div>
          
          {/* Mentor List - Takes less space */}
          <div className="flex-1 lg:flex-[1]">
            <MentorList />
          </div>
        </div>

        {/* Bottom Section - Mentor Table */}
        <MentorTableSection />
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
          <Link to="/"><SidebarItem icon={faTachometerAlt} text="Dashboard"active /></Link>
          <Link to="/quests"><SidebarItem icon={faCircleQuestion} text="Learning Quests" /></Link>
          <Link to="/quizes"><SidebarItem icon={faBook} text="Quizzes and Challenges" /></Link>
          <Link to="/badges"><SidebarItem icon={faTrophy} text="Badges And Achievement" /></Link>
          <Link to="/growth"><SidebarItem icon={faArrowUpRightDots} text="Career Growth Graphs" /></Link>
          <Link to="/forum"><SidebarItem icon={faUsers} text="Discussion Forums" /></Link>
          <Link to="/leader"><SidebarItem icon={faBookOpenReader} text="Leader Board" /></Link>
          <Link to="/chat-bot"><SidebarItem icon={faWebAwesome} text="Chatbot" /></Link>
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
    <li className={`mb-4 flex items-center ${active ? 'text-purple-600' : ''} ${logout ? 'text-red-600' : ''}`}>
      <FontAwesomeIcon icon={icon} className="mr-2 w-4" />
      {text}
    </li>
  );
};

const FriendItem = ({ name, role, imgSrc }) => {
  return (
    <li className="mb-4 flex items-center">
      <img alt={name} className="w-8 h-8 rounded-full mr-2" src={imgSrc} />
      <div>
        <div>{name}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </li>
  );
};

const StatsCard = ({ value, label }) => {
  return (
    <div className="bg-white p-4 rounded-lg text-center shadow-sm">
      <div className="text-purple-600 text-xl font-semibold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
};

const ProfileCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-70">
      <img 
        alt="Profile Picture" 
        className="w-16 h-16 rounded-full mx-auto mb-4" 
        src="https://storage.googleapis.com/a1aa/image/i88OePYu96HwF8JP7itgOMOpGkDjF7QGr3Teaogmrdo.jpg" 
      />
      <div className="text-lg font-semibold text-center">Good Morning Alex</div>
      <div className="text-sm text-gray-500 mb-4 text-center">
        Continue Your Journey And Achieve Your Target
      </div>
      <div className="flex justify-center space-x-4">
        <FontAwesomeIcon icon={faBell} className="text-gray-500 hover:text-purple-600 cursor-pointer" />
        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 hover:text-purple-600 cursor-pointer" />
        <FontAwesomeIcon icon={faCog} className="text-gray-500 hover:text-purple-600 cursor-pointer" />
      </div>
      <Link to="/signup">
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Register Now
                </button></Link>
    </div>
    
  );
};

const MentorList = () => {
  const mentors = [
    {
      name: "Kiliam Rosvelt",
      role: "Software Developer",
      imgSrc: "https://storage.googleapis.com/a1aa/image/gH4jx4BZMJWm9qynqlMzUHplJ5cATMKVQCffRFtArIU.jpg"
    },
    {
      name: "Teodor Maskevich",
      role: "Product Owner",
      imgSrc: "https://storage.googleapis.com/a1aa/image/hA071g6XRu6MqwsA_zHaCSSsnC0RK8SrFVz4Ef3DEFs.jpg"
    },
    {
      name: "Andrew Kooller",
      role: "Frontend Developer",
      imgSrc: "https://storage.googleapis.com/a1aa/image/cKbkWskeE6rOQC5kDltCqfqlVYYERAcjYFhl6EzM5pw.jpg"
    },
    {
      name: "Adam Chekish",
      role: "Backend Developer",
      imgSrc: "https://storage.googleapis.com/a1aa/image/dkaIdpzqlqPON0FSnBLa2gdo67vjdWOHiXVd2YSelxQ.jpg"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h2 className="text-lg font-semibold mb-4">Your Mentor</h2>
      <ul className="space-y-4">
        {mentors.map((mentor, index) => (
          <li key={index} className="flex items-center">
            <img alt={mentor.name} className="w-10 h-10 rounded-full mr-3" src={mentor.imgSrc} />
            <div className="flex-1">
              <div className="font-medium">{mentor.name}</div>
              <div className="text-sm text-gray-500">{mentor.role}</div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors">
              Follow
            </button>
          </li>
        ))}
      </ul>
      <button className="text-purple-600 hover:text-purple-800 w-full py-2 mt-4 text-sm font-medium transition-colors">
        View All Mentors →
      </button>
    </div>
  );
};

const ContinueWatchingSection = () => {
  const courses = [
    {
      type: "FRONTEND",
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      imgSrc: "https://storage.googleapis.com/a1aa/image/ekgy5VcEHAG4uGDN9r-fMcaQVbwhmpxDyC9I9ATzT2M.jpg",
      views: 124,
      users: 124
    },
    {
      type: "BACKEND",
      title: "Beginner's Guide To Becoming A Professional Backend Developer",
      imgSrc: "https://storage.googleapis.com/a1aa/image/h5gVp7p2lLViz_PmDmbGCesh-QGlUkUHRcu72vZkRdc.jpg",
      views: 27,
      users: 27
    },
    {
      type: "FRONTEND",
      title: "Advanced React Patterns",
      imgSrc: "https://storage.googleapis.com/a1aa/image/ekgy5VcEHAG4uGDN9r-fMcaQVbwhmpxDyC9I9ATzT2M.jpg",
      views: 67,
      users: 67
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Continue Watching</h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="flex items-start space-x-4">
            <img 
              alt={course.type + " Course"} 
              className="w-24 h-16 object-cover rounded-lg" 
              src={course.imgSrc} 
            />
            <div className="flex-1">
              <div className="text-purple-600 text-sm font-semibold">{course.type}</div>
              <h3 className="font-medium line-clamp-2">{course.title}</h3>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>{course.views} views</span>
                <span className="mx-2">•</span>
                <span>{course.users} students</span>
              </div>
            </div>
            <button className="text-purple-600 hover:text-purple-800">
              <FontAwesomeIcon icon={faPlay} />
            </button>
          </div>
        ))}
      </div>
      <button className="text-purple-600 hover:text-purple-800 w-full py-2 mt-4 text-sm font-medium transition-colors">
        View All Courses →
      </button>
    </div>
  );
};

const MentorTableSection = () => {
  const mentors = [
    {
      name: "Alex Morgan",
      date: "25/02/2023",
      type: "FRONTEND",
      title: "Understanding Concept Of React"
    },
    {
      name: "Nikolas Helmet",
      date: "18/03/2023",
      type: "BACKEND",
      title: "Concept Of The Data Base"
    },
    {
      name: "Josh Freakson",
      date: "12/04/2023",
      type: "BACKEND",
      title: "Core Development Approaches"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Mentor Activities</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentors.map((mentor, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium">{mentor.name}</div>
                  <div className="text-sm text-gray-500">{mentor.date}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                    {mentor.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{mentor.title}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;