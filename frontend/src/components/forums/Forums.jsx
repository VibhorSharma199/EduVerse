import React, { useState, useEffect } from 'react';
import { FaSearch, FaComment, FaUserGraduate, FaThumbsUp, FaReply, FaBookOpen, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, faCircleQuestion, faBook, faUsers, 
  faCog, faSignOutAlt, faBell, faEnvelope, faPlay, faEllipsisH, 
  faTrophy,
  faArrowUpRightDots,
  faBookOpenReader,
  faWebAwesome
} from '@fortawesome/free-solid-svg-icons';

const Forums = () => {
  const [activeTab, setActiveTab] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [replies, setReplies] = useState({});
  const [newReply, setNewReply] = useState('');

  // Sample data initialization
  useEffect(() => {
    const sampleThreads = [
      {
        id: 1,
        title: 'Best practices for online learning?',
        author: 'JaneDoe',
        category: 'learning-methods',
        date: '2023-05-15',
        views: 1245,
        replies: 23,
        likes: 45,
        content: 'I wanted to discuss what strategies have worked best for everyone when it comes to online learning. Personally, I find the Pomodoro technique very effective.',
        isLiked: false
      },
      {
        id: 2,
        title: 'JavaScript frameworks for beginners',
        author: 'CodeNewbie',
        category: 'programming',
        date: '2023-05-18',
        views: 892,
        replies: 15,
        likes: 32,
        content: 'Which JavaScript framework would you recommend for someone just starting out with web development?',
        isLiked: false
      },
      {
        id: 3,
        title: 'How to stay motivated during long courses?',
        author: 'LifelongLearner',
        category: 'motivation',
        date: '2023-05-20',
        views: 567,
        replies: 12,
        likes: 28,
        content: 'I often struggle with motivation when taking longer courses. Does anyone have tips for staying engaged?',
        isLiked: true
      }
    ];

    const sampleReplies = {
      1: [
        { id: 1, author: 'StudyBuddy', date: '2023-05-16', content: 'I agree! Pomodoro technique changed my study habits completely.', likes: 8 },
        { id: 2, author: 'EduEnthusiast', date: '2023-05-17', content: 'Has anyone tried the Feynman technique? It works wonders for conceptual subjects.', likes: 12 }
      ],
      2: [
        { id: 1, author: 'WebDevPro', date: '2023-05-19', content: 'Start with vanilla JS before jumping into frameworks. Master the fundamentals first!', likes: 15 }
      ],
      3: [
        { id: 1, author: 'MotivationMaster', date: '2023-05-21', content: 'Set small milestones and reward yourself when you achieve them!', likes: 7 },
        { id: 2, author: 'CourseTaker', date: '2023-05-22', content: 'Find a study partner - accountability helps a lot.', likes: 5 }
      ]
    };

    setThreads(sampleThreads);
    setReplies(sampleReplies);
  }, []);

  const handleThreadSubmit = (e) => {
    e.preventDefault();
    const newThreadObj = {
      id: threads.length + 1,
      title: newThread.title,
      author: 'CurrentUser',
      category: newThread.category,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      replies: 0,
      likes: 0,
      content: newThread.content,
      isLiked: false
    };
    setThreads([newThreadObj, ...threads]);
    setNewThread({ title: '', content: '', category: 'general' });
    setShowNewThreadForm(false);
  };

  const handleReplySubmit = (threadId) => {
    if (!newReply.trim()) return;
    
    const newReplyObj = {
      id: (replies[threadId]?.length || 0) + 1,
      author: 'CurrentUser',
      date: new Date().toISOString().split('T')[0],
      content: newReply,
      likes: 0
    };

    setReplies({
      ...replies,
      [threadId]: [...(replies[threadId] || []), newReplyObj]
    });

    // Update reply count in thread
    setThreads(threads.map(thread => 
      thread.id === threadId 
        ? { ...thread, replies: thread.replies + 1 } 
        : thread
    ));

    setNewReply('');
  };

  const toggleLike = (threadId) => {
    setThreads(threads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1,
          isLiked: !thread.isLiked
        };
      }
      return thread;
    }));
  };

  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'general', name: 'General Discussion' },
    { id: 'programming', name: 'Programming' },
    { id: 'learning-methods', name: 'Learning Methods' },
    { id: 'motivation', name: 'Motivation' },
    { id: 'career-advice', name: 'Career Advice' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800 font-inter">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-purple-800 flex items-center">
                <FaComment className="mr-3" /> EduSphere Community Forums
              </h1>
              <p className="text-purple-600">Connect, learn, and grow with fellow learners</p>
            </div>
            <button 
              onClick={() => setShowNewThreadForm(!showNewThreadForm)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center transition"
            >
              <FaPlus className="mr-2" /> New Thread
            </button>
          </div>

          {/* New Thread Form */}
          {showNewThreadForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-purple-200">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Create New Thread</h2>
              <form onSubmit={handleThreadSubmit}>
                <div className="mb-4">
                  <label className="block text-purple-800 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                    className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="What's your question?"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-purple-800 font-medium mb-2">Category</label>
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({...newThread, category: e.target.value})}
                    className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-purple-800 font-medium mb-2">Content</label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                    className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[150px]"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadForm(false)}
                    className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
                  >
                    Post Thread
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="relative mb-4 md:mb-0 md:w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-purple-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Search discussions..."
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'popular' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'recent' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                >
                  Recent
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === category.id ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-6">
            {filteredThreads.length > 0 ? (
              filteredThreads.map(thread => (
                <div key={thread.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        to={`/forum/${thread.id}`} 
                        className="text-xl font-bold text-purple-800 hover:underline"
                      >
                        {thread.title}
                      </Link>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                        {categories.find(c => c.id === thread.category)?.name || 'General'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{thread.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaUserGraduate className="mr-1 text-purple-600" />
                        <span className="mr-3">{thread.author}</span>
                        <span>{thread.date}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => toggleLike(thread.id)}
                          className={`flex items-center ${thread.isLiked ? 'text-purple-700' : 'text-gray-500 hover:text-purple-700'}`}
                        >
                          <FaThumbsUp className="mr-1" /> {thread.likes}
                        </button>
                        <span className="flex items-center">
                          <FaComment className="mr-1 text-purple-600" /> {thread.replies}
                        </span>
                        <span>👁️ {thread.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {replies[thread.id] && replies[thread.id].length > 0 && (
                    <div className="bg-purple-50 p-4 border-t border-purple-200">
                      <h3 className="font-medium text-purple-800 mb-3">Replies ({replies[thread.id].length})</h3>
                      <div className="space-y-4">
                        {replies[thread.id].map(reply => (
                          <div key={reply.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <span className="font-medium text-purple-700">{reply.author}</span>
                              <span>{reply.date}</span>
                            </div>
                            <p className="text-gray-700">{reply.content}</p>
                            <div className="flex justify-end mt-2">
                              <button className="text-purple-600 hover:text-purple-800 text-sm flex items-center">
                                <FaThumbsUp className="mr-1" /> {reply.likes}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="bg-purple-100 p-4 border-t border-purple-200">
                    <div className="flex items-start">
                      <div className="flex-1 mr-2">
                        <textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Write your reply..."
                          rows="2"
                        />
                      </div>
                      <button
                        onClick={() => handleReplySubmit(thread.id)}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center transition"
                      >
                        <FaReply className="mr-1" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaBookOpen className="mx-auto text-4xl text-purple-500 mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">No discussions found</h3>
                <p className="text-gray-600 mb-4">Be the first to start a conversation in this category!</p>
                <button
                  onClick={() => setShowNewThreadForm(true)}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg flex items-center mx-auto transition"
                >
                  <FaPlus className="mr-2" /> Start a New Thread
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
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
                 <Link to="/"><SidebarItem icon={faTachometerAlt} text="Dashboard"/></Link>
                 <Link to="/quests"><SidebarItem icon={faCircleQuestion} text="Learning Quests"/></Link>
                 <Link to="/quizes"><SidebarItem icon={faBook} text="Quizzes and Challenges" /></Link>
                 <Link to="/badges"><SidebarItem icon={faTrophy} text="Badges And Achievement" /></Link>
                 <Link to="/growth"><SidebarItem icon={faArrowUpRightDots} text="Career Growth Graphs" /></Link>
                 <Link to="/forum"><SidebarItem icon={faUsers} text="Discussion Forums" active/></Link>
                 <Link to="/leader"><SidebarItem icon={faBookOpenReader} text="Leader Board" /></Link>
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
    <li className={`mb-4 flex items-center ${active ? 'text-purple-600' : ''} ${logout ? 'text-red-600' : ''}`}>
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

export default Forums;