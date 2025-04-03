import React , { useState, useEffect }  from 'react';
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

const initialMessages = [
    { sender: 'bot', text: 'Hello! I am your AI study assistant. How can I help you today?' },
  ];

const ChatBot = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
  
    const handleSend = () => {
      if (!input.trim()) return;
  
      const newMessage = { sender: 'user', text: input };
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
  
      setTimeout(() => handleBotReply(input), 500);
    };
  
    const handleBotReply = (userMessage) => {
      let reply = 'Im not sure I understand. Can you try asking in a different way?';
  
      if (userMessage.toLowerCase().includes('course')) {
        reply = 'I can help you find information about courses. What subject are you interested in?';
      } else if (userMessage.toLowerCase().includes('math')) {
        reply = 'For Math, you can explore our tutorials on Calculus, Algebra, and Geometry.';
      } else if (userMessage.toLowerCase().includes('physics')) {
        reply = 'Physics topics like Optics, Mechanics, and Thermodynamics are covered in detail.';
      }
  
      const botMessage = { sender: 'bot', text: reply };
      setMessages((prev) => [...prev, botMessage]);
    };

  return (
    <div className="flex min-h-screen right-0 mr-0 bg-gray-100 text-gray-800 font-inter">
      {/* Sidebar */}
      <Sidebar />
      <div className='flex-1 mt-5'>
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">Send</button>
      </div>
    </div>
      </div>
    </div>
  )
}

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

export default ChatBot
