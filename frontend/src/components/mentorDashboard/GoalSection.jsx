import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function GoalSection() {
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Complete JavaScript fundamentals',
      deadline: '2024-04-01',
      completed: false,
    },
    {
      id: '2',
      title: 'Build portfolio project',
      deadline: '2024-04-15',
      completed: true,
    },
  ]);

  const [newGoal, setNewGoal] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const addGoal = () => {
    if (newGoal && newDeadline) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          title: newGoal,
          deadline: newDeadline,
          completed: false,
        },
      ]);
      setNewGoal('');
      setNewDeadline('');
    }
  };

  const toggleGoal = (id) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-col">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add new goal"
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <button
          onClick={addGoal}
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                className="h-4 w-4 text-indigo-600"
              />
              <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                {goal.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{goal.deadline}</span>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}