import React from 'react';

export default function Analytics() {
  const metrics = {
    sessionCount: 24,
    averageEngagement: 46,
    completionRate: 78,
    totalHours: 36,
  };

  const generateBarChart = (percentage) => (
    <div className="h-24 flex items-end">
      <div
        style={{ height: `${percentage}%` }}
        className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500"
      ></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Sessions This Month</h3>
        {generateBarChart((metrics.sessionCount / 30) * 100)}
        <div className="mt-2 text-center">
          <span className="text-2xl font-bold text-indigo-600">
            {metrics.sessionCount}
          </span>
          <span className="text-gray-500 ml-1">sessions</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Average Engagement</h3>
        {generateBarChart(metrics.averageEngagement)}
        <div className="mt-2 text-center">
          <span className="text-2xl font-bold text-indigo-600">
            {metrics.averageEngagement}%
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Task Completion Rate</h3>
        {generateBarChart(metrics.completionRate)}
        <div className="mt-2 text-center">
          <span className="text-2xl font-bold text-indigo-600">
            {metrics.completionRate}%
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Total Hours</h3>
        {generateBarChart((metrics.totalHours / 40) * 100)}
        <div className="mt-2 text-center">
          <span className="text-2xl font-bold text-indigo-600">
            {metrics.totalHours}
          </span>
          <span className="text-gray-500 ml-1">hours</span>
        </div>
      </div>
    </div>
  );
}