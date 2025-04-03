import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
  const [sessions, setSessions] = useState([
    {
      id: '1',
      title: 'Code Review',
      date: '2024-03-20',
      time: '10:00 AM',
      mentee: 'Alex Johnson',
    },
    {
      id: '2',
      title: 'Project Planning',
      date: '2024-03-21',
      time: '2:00 PM',
      mentee: 'Sarah Williams',
    },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  const prevWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevWeek}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-medium">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextWeek}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-gray-600">with {session.mentee}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{session.time}</p>
                <p className="text-sm text-gray-500">{session.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
        Schedule New Session
      </button>
    </div>
  );
}