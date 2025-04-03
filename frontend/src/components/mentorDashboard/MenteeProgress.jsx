import React from 'react';

export default function MenteeProgress() {
  const mentees = [
    { id: '1', name: 'Alex Johnson', progress: 75, lastActive: '2 hours ago' },
    { id: '2', name: 'Sarah Williams', progress: 45, lastActive: '1 day ago' },
    { id: '3', name: 'Michael Brown', progress: 90, lastActive: '30 minutes ago' },
  ];

  return (
    <div className="space-y-4">
      {mentees.map((mentee) => (
        <div key={mentee.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">{mentee.name}</h3>
            <span className="text-sm text-gray-500">Last active: {mentee.lastActive}</span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {mentee.progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${mentee.progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}