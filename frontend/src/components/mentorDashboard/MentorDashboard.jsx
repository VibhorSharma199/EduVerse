import React from 'react';
import { Users, Target, MessageSquare, Calendar, BarChart3, FileBox } from 'lucide-react';
import MenteeProgress from './MenteeProgress';
import GoalSection from './GoalSection';
import ChatInterface from './ChatInterface';
import CalendarView from './CalendarView';
import Analytics from './Analytics';
import ResourceLibrary from './ResourceLibrary';
import Sidebar from './Sidebar'

export default function MentorDashboard() {
  return (
    <div className='flex'>
      <div className='w-[300px]'>
        <Sidebar />
      </div>
      <div className="min-h-screen bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your mentees' progress.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mentee Progress Section */}
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-indigo-500 mr-2" />
                  <h2 className="text-xl font-semibold">Mentee Progress</h2>
                </div>
                <MenteeProgress />
              </div>
            </div>

            {/* Goals Section */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-semibold">Goals</h2>
                </div>
                <GoalSection />
              </div>
            </div>

            {/* Chat Interface */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold">Messages</h2>
                </div>
                <ChatInterface />
              </div>
            </div>

            {/* Calendar View */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-500 mr-2" />
                  <h2 className="text-xl font-semibold">Calendar</h2>
                </div>
                <CalendarView />
              </div>
            </div>

            {/* Analytics Section */}
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-500 mr-2" />
                  <h2 className="text-xl font-semibold">Analytics</h2>
                </div>
                <Analytics />
              </div>
            </div>

            {/* Resource Library */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <FileBox className="h-6 w-6 text-red-500 mr-2" />
                  <h2 className="text-xl font-semibold">Resources</h2>
                </div>
                <ResourceLibrary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}