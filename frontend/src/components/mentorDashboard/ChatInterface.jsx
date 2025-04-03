import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Alex',
      content: 'Hi, I need help with the React assignment',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      sender: 'You',
      content: "Sure, I'd be happy to help. What's the specific issue?",
      timestamp: '10:32 AM',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          sender: 'You',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'You' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'You'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-sm font-medium mb-1">{message.sender}</div>
              <div className="text-sm">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'You' ? 'text-indigo-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}