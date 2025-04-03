import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faCircleQuestion, faBook, faUsers, 
  faCog, faSignOutAlt, faBell, faEnvelope, faPlay, faEllipsisH, 
  faTrophy, faArrowUpRightDots, faBookOpenReader, faWebAwesome
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaAward, FaCertificate, FaBookOpen, FaHome, FaTrophy as FaTrophy2 } from 'react-icons/fa';

const Badges = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 font-inter">
      {/* Sidebar - Updated to match CareerGrowth.jsx */}
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
            <Link to="/"><SidebarItem icon={faTachometerAlt} text="Dashboard"/></Link>
            <Link to="/quests"><SidebarItem icon={faCircleQuestion} text="Learning Quests"/></Link>
            <Link to="/quizes"><SidebarItem icon={faBook} text="Quizzes and Challenges"/></Link>
            <Link to="/badges"><SidebarItem icon={faTrophy} text="Badges And Achievement" active/></Link>
            <Link to="/growth"><SidebarItem icon={faArrowUpRightDots} text="Career Growth Graphs"/></Link>
            <Link to="/forum"><SidebarItem icon={faUsers} text="Discussion Forums"/></Link>
            <Link to="/leader"><SidebarItem icon={faBookOpenReader} text="Leader Board"/></Link>
            <SidebarItem icon={faWebAwesome} text="Chatbot"/>
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
            <SidebarItem icon={faCog} text="Settings"/>
            <SidebarItem icon={faSignOutAlt} text="Logout" logout/>
          </ul>
        </div>
      </div>

      {/* Main Content Area - Rest of your existing Badges content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 rounded-2xl mb-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Learning Dashboard</h1>
                <p className="text-purple-200 max-w-2xl">
                  Track your educational progress and showcase your digital achievements
                </p>
              </div>
              <button className="bg-white text-purple-700 px-6 py-2 rounded-full font-bold hover:bg-purple-100 transition">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="bg-purple-100 p-4 rounded-full mr-4">
              <FaBookOpen className="text-purple-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-purple-800">4</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="bg-green-100 p-4 rounded-full mr-4">
              <FaAward className="text-green-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600">New Badges</p>
              <p className="text-2xl font-bold text-green-800">3</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="bg-blue-100 p-4 rounded-full mr-4">
              <FaCertificate className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-blue-800">5</p>
            </div>
          </div>
        </div>

        {/* Achievement Badges Section */}
        <div className="bg-white p-8 rounded-2xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <FaAward className="text-purple-600 mr-3" />
              Your Achievement Badges
            </h2>
            <a href="#" className="text-purple-600 hover:underline">View All</a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Fast Learner", img: "lbUMZuakG9WWRBEsPUlUkTNycIfEAmvzOl5ucPrvwUw.jpg", earned: true },
              { name: "Quiz Master", img: "l8xqOuSZ4qrAW2C4nFlDjbMj9sBtvqG5C1r5gbFtDoE.jpg", earned: true },
              { name: "Course Explorer", img: "ezsJQRJijtZOJ8K-rCQOJDIBVPPx9xTO6LwXs59WIs0.jpg", earned: true },
              { name: "Discussion Leader", img: "kh2uAxZljik_jU0tRe8vsM1qMk9gSnF-WG4G6FkDQ90.jpg", earned: true },
              { name: "Perfect Score", img: "lbUMZuakG9WWRBEsPUlUkTNycIfEAmvzOl5ucPrvwUw.jpg", earned: false },
              { name: "Early Bird", img: "l8xqOuSZ4qrAW2C4nFlDjbMj9sBtvqG5C1r5gbFtDoE.jpg", earned: false },
            ].map((badge, index) => (
              <div key={index} className={`text-center p-4 rounded-xl transition-all ${badge.earned ? 'bg-white hover:shadow-lg' : 'bg-gray-100 opacity-60'}`}>
                <div className={`p-2 rounded-full w-20 h-20 mx-auto flex items-center justify-center ${badge.earned ? 'bg-purple-100' : 'bg-gray-200'}`}>
                  <img 
                    alt={badge.name} 
                    className="w-12 h-12 object-contain" 
                    src={`https://storage.googleapis.com/a1aa/image/${badge.img}`} 
                  />
                </div>
                <p className={`font-medium mt-3 ${badge.earned ? 'text-purple-800' : 'text-gray-500'}`}>{badge.name}</p>
                {badge.earned ? (
                  <span className="text-xs text-green-600 mt-1">Earned</span>
                ) : (
                  <span className="text-xs text-gray-500 mt-1">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Paths Section */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <FaCertificate className="text-purple-600 mr-3" />
              Your Learning Paths
            </h2>
            <a href="#" className="text-purple-600 hover:underline">Browse Courses</a>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { 
                title: "Digital Skills Foundations", 
                desc: "Build essential digital literacy for the modern workplace",
                icon: "ulSA2_0BrCZCJxCVvqS2oXHaMwQfNMxkhVsmx9C2wCQ.jpg",
                progress: 75,
                category: "Technology",
                duration: "8 weeks"
              },
              { 
                title: "Advanced Data Analysis", 
                desc: "Master data interpretation and visualization techniques",
                icon: "YjwipiMfvyA0B_rQ0pc4ZNdAMfuqLLzxe7hqnyeIy0Q.jpg",
                progress: 30,
                category: "Data Science",
                duration: "10 weeks"
              },
              { 
                title: "Professional Certification Prep", 
                desc: "Prepare for industry-recognized certification exams",
                icon: "H0UWipU-V8JXhu4Yz5agPD4-dqTNt7rzuhJFEK1Mihw.jpg",
                progress: 10,
                category: "Career Development",
                duration: "12 weeks"
              },
              { 
                title: "Leadership in Tech", 
                desc: "Develop leadership skills for technology teams",
                icon: "ulSA2_0BrCZCJxCVvqS2oXHaMwQfNMxkhVsmx9C2wCQ.jpg",
                progress: 5,
                category: "Management",
                duration: "6 weeks"
              }
            ].map((course, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group">
                <div className="flex">
                  <div className="relative">
                    <img 
                      alt={course.title} 
                      className="w-16 h-16 mr-4 rounded-lg object-cover" 
                      src={`https://storage.googleapis.com/a1aa/image/${course.icon}`} 
                    />
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-purple-800 group-hover:text-purple-600 transition">{course.title}</h3>
                    <p className="text-gray-600 mt-1">{course.desc}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{course.progress}% • {course.duration}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for sidebar items
const SidebarItem = ({ icon, text, active = false, logout = false }) => {
  return (
    <li className={`mb-4 flex items-center ${active ? 'text-purple-600 font-semibold' : ''} ${logout ? 'text-red-600' : ''}`}>
      <FontAwesomeIcon icon={icon} className="mr-2 w-4" />
      {text}
    </li>
  );
};

// Component for friend items
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

export default Badges;