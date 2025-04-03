import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faCircleQuestion, faBook, faUsers, 
  faCog, faSignOutAlt, faBell, faEnvelope, faPlay, faEllipsisH, 
  faTrophy, faArrowUpRightDots, faBookOpenReader, faWebAwesome,
  faChartLine, faLightbulb, faRoad, faCode, faLaptopCode, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CareerGrowth = () => {
  const [selectedSkill, setSelectedSkill] = React.useState('JavaScript');
  const [timeRange, setTimeRange] = React.useState('year');
  const [roadmapSkill, setRoadmapSkill] = React.useState('JavaScript');

  // Data for the bar chart
  const barChartData = {
    datasets: [
      {
        label: 'Courses Completed',
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
      },
      {
        label: 'Projects Built',
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Coding Hours',
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      }
    ],
  };

  // Data for the pie chart
  const pieChartData = {
    labels: ['JavaScript', 'React', 'Node.js', 'Python', 'Other'],
    datasets: [
      {
        data: [31, 22, 15, 15, 17],
        backgroundColor: [
          'rgba(124, 58, 237, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(156, 163, 175, 0.7)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Skill Roadmap Data
  const skillRoadmaps = {
    'JavaScript': [
      { month: 'Month 1', tasks: ['Complete ES6 Fundamentals', 'Build 10 small projects', 'Solve 30 coding challenges'] },
      { month: 'Month 2', tasks: ['Learn Design Patterns', 'Complete Advanced JS Course', 'Build a portfolio project'] },
      { month: 'Month 3', tasks: ['Master Async Programming', 'Learn Testing with Jest', 'Contribute to open source'] }
    ],
    'React': [
      { month: 'Month 1', tasks: ['Complete React Basics', 'Build 3 component-based apps', 'Learn React Hooks'] },
      { month: 'Month 2', tasks: ['State Management with Redux', 'Complete Advanced React Course', 'Build a full-stack app'] },
      { month: 'Month 3', tasks: ['Performance Optimization', 'Learn Server-side Rendering', 'Build a complex dashboard'] }
    ],
    'Node.js': [
      { month: 'Month 1', tasks: ['Learn Core Modules', 'Build REST API', 'Complete Node Fundamentals'] },
      { month: 'Month 2', tasks: ['Database Integration', 'Authentication Systems', 'Complete Backend Course'] },
      { month: 'Month 3', tasks: ['Microservices Architecture', 'Deployment Strategies', 'Build a scalable API'] }
    ],
    'Python': [
      { month: 'Month 1', tasks: ['Python Fundamentals', 'Complete Data Structures', 'Build CLI tools'] },
      { month: 'Month 2', tasks: ['Web Development with Django', 'Complete Algorithms Course', 'Build a web scraper'] },
      { month: 'Month 3', tasks: ['Data Analysis with Pandas', 'Machine Learning Basics', 'Automation Scripts'] }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: { y: { beginAtZero: true } }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  // Generate chart data based on time range
  const getChartData = () => {
    const labels = timeRange === 'year' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const coursesData = timeRange === 'year' 
      ? [2, 3, 5, 4, 6, 8, 7, 9, 10, 8, 6, 7]
      : [3, 4, 5, 6, 7, 8];
    
    const projectsData = timeRange === 'year' 
      ? [1, 2, 3, 2, 4, 5, 6, 7, 8, 6, 5, 7]
      : [2, 3, 4, 5, 6, 7];
    
    const hoursData = timeRange === 'year' 
      ? [20, 25, 30, 35, 40, 45, 50, 55, 60, 50, 45, 55]
      : [30, 35, 40, 45, 50, 55];

    return {
      labels,
      datasets: [
        { ...barChartData.datasets[0], data: coursesData },
        { ...barChartData.datasets[1], data: projectsData },
        { ...barChartData.datasets[2], data: hoursData }
      ]
    };
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 font-inter">
      {/* Sidebar */}
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
            <Link to="/badges"><SidebarItem icon={faTrophy} text="Badges And Achievement"/></Link>
            <Link to="/growth"><SidebarItem icon={faArrowUpRightDots} text="Learning Progress" active/></Link>
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
              role="Web Developer" 
              imgSrc="https://storage.googleapis.com/a1aa/image/Uvfi4E1H5sZH_zeBWy20ktPIJwvjVPTX2v5UCGSBlmc.jpg" 
            />
            <FriendItem 
              name="Jeff Linkoln" 
              role="Python Mentor" 
              imgSrc="https://storage.googleapis.com/a1aa/image/vXSsRsaaywWwClXN3DvfIaIp1wPesYN4VD7Ijpoo0fU.jpg" 
            />
            <FriendItem 
              name="Sasha Melstone" 
              role="React Expert" 
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-purple-800">Learning Progress Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-purple-600">
              <FontAwesomeIcon icon={faBell} size="lg"/>
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600">
              <FontAwesomeIcon icon={faEnvelope} size="lg"/>
            </button>
            <img 
              alt="User profile" 
              className="rounded-full w-10 h-10" 
              src="https://storage.googleapis.com/a1aa/image/b-14myqT5Un6DqRRfpDMiuqR6tF9byIG77sxnzCfSes.jpg" 
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Courses Completed" 
            value="42" 
            change="+15% from last month" 
            icon={faGraduationCap}
            color="purple"
          />
          <StatCard 
            title="Projects Built" 
            value="27" 
            change="+8% from last month" 
            icon={faLaptopCode}
            color="blue"
          />
          <StatCard 
            title="Coding Hours" 
            value="386" 
            change="+12% from last month" 
            icon={faCode}
            color="green"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Learning Path Analysis - 2 columns */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-xl font-bold text-purple-800 mb-4">
              Learning Path Analysis
            </h2>
            <p className="text-gray-600 mb-4">
              Your learning progression in last 30 days
            </p>
            <div className="space-y-4">
              <MetricCard 
                title="Lessons Completed" 
                value="87" 
                change="+15% Higher than last month" 
              />
              <MetricCard 
                title="Challenges Solved" 
                value="42" 
                change="+8% Higher than last month" 
              />
            </div>
          </div>

          {/* Learning Progress - 3 columns */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-800">
                Learning Progress
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTimeRange('year')}
                  className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  This year
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  Last 6 months
                </button>
              </div>
            </div>
            <div className="mt-4 h-80">
              <Bar options={barChartOptions} data={getChartData()} />
            </div>
          </div>

          {/* Top Skills - 3 columns (expanded width) */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-800 flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Skill Proficiency
              </h2>
              <div className="text-sm text-gray-500">
                <span className="font-bold text-purple-700">1,240</span> skill points
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Pie Chart */}
              <div className="flex-1">
                <div className="h-64">
                  <Pie options={pieChartOptions} data={pieChartData} />
                </div>
              </div>
              
              {/* Skill Proficiency List */}
              <div className="flex-1">
                <div className="space-y-4">
                  {['JavaScript', 'React', 'Node.js', 'Python'].map((skill) => {
                    const percentage = 
                      skill === 'JavaScript' ? 80 :
                      skill === 'React' ? 57 : 46;
                    const level = 
                      skill === 'JavaScript' ? 'Advanced' : 'Intermediate';
                    
                    return (
                      <SkillItem 
                        key={skill}
                        name={skill}
                        percentage={percentage}
                        level={level}
                        description={skill === 'JavaScript' ? 'Core language' : 
                                     skill === 'React' ? 'Frontend' : 
                                     skill === 'Node.js' ? 'Backend' : 'General purpose'}
                        onClick={() => {
                          setSelectedSkill(skill);
                          setRoadmapSkill(skill);
                        }}
                        active={selectedSkill === skill}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Skill Improvement Suggestions */}
            {selectedSkill && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3">
                  <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
                  Improve your {selectedSkill} skills
                </h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                  {selectedSkill === 'JavaScript' && (
                    <>
                      <li>Complete advanced ES6+ features course</li>
                      <li>Practice algorithm challenges on Codewars</li>
                      <li>Build a project using design patterns</li>
                    </>
                  )}
                  {selectedSkill === 'React' && (
                    <>
                      <li>Learn advanced React hooks patterns</li>
                      <li>Explore state management with Context + Reducer</li>
                      <li>Optimize performance with memoization</li>
                    </>
                  )}
                  {selectedSkill === 'Node.js' && (
                    <>
                      <li>Study asynchronous patterns</li>
                      <li>Build a REST API with Express</li>
                      <li>Learn about worker threads</li>
                    </>
                  )}
                  {selectedSkill === 'Python' && (
                    <>
                      <li>Practice data structures implementations</li>
                      <li>Learn about decorators and generators</li>
                      <li>Explore popular frameworks like Django/Flask</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Skill Development Roadmap - 2 columns */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faRoad} className="mr-2" />
              Learning Roadmap
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Skill to Learn
              </label>
              <select
                value={roadmapSkill}
                onChange={(e) => setRoadmapSkill(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-200 bg-white"
              >
                {['JavaScript', 'React', 'Node.js', 'Python'].map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-6">
              {skillRoadmaps[roadmapSkill]?.map((stage, index) => (
                <div key={index} className="relative pl-6 pb-6 border-l-2 border-purple-300">
                  <div className="absolute w-4 h-4 bg-purple-500 rounded-full -left-2 top-0"></div>
                  <h3 className="font-semibold text-purple-700 mb-2">{stage.month}</h3>
                  <ul className="space-y-2">
                    {stage.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start">
                        <span className="flex items-center justify-center w-5 h-5 bg-purple-100 text-purple-600 rounded-full mr-2 mt-0.5 flex-shrink-0">
                          <FontAwesomeIcon icon={faLightbulb} size="xs" />
                        </span>
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center">
              <FontAwesomeIcon icon={faArrowUpRightDots} className="mr-2" />
              Download Full Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, active = false, logout = false }) => {
  return (
    <li className={`mb-4 flex items-center ${active ? 'text-purple-600 font-semibold' : ''} ${logout ? 'text-red-600' : ''}`}>
      <FontAwesomeIcon icon={icon} className="mr-2 w-4" />
      {text}
    </li>
  );
};

// Friend Item Component
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

// Stat Card Component
const StatCard = ({ title, value, change, icon, color }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-600">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
          <p className="text-green-500">{change}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <FontAwesomeIcon icon={icon} size="lg"/>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, change }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-gray-600">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-green-500">{change}</p>
    </div>
  );
};

// Skill Item Component
const SkillItem = ({ name, percentage, level, description, onClick, active = false }) => {
  return (
    <div 
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
        active ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="w-2/5">
        <div className={`font-medium ${active ? 'text-purple-800' : 'text-gray-600'}`}>
          {name}
        </div>
        {level && (
          <div className="text-xs text-gray-500 mt-1">
            {level} - {description}
          </div>
        )}
      </div>
      <div className="w-3/5 flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
          <div 
            className={`h-2 rounded-full ${
              active ? 'bg-purple-600' : 'bg-purple-400'
            }`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className={`text-sm ${
          active ? 'text-purple-800 font-medium' : 'text-gray-600'
        }`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default CareerGrowth;