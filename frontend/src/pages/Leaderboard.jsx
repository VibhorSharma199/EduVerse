import React, { useState, useEffect } from "react";
import {
  getGlobalLeaderboard,
  getCourseLeaderboard,
  getMonthlyLeaderboard,
} from "../api/leaderboard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("global"); // global, course, monthly

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        let data;
        switch (view) {
          case "global":
            data = await getGlobalLeaderboard();
            break;
          case "course":
            // You'll need to get the current course ID from somewhere
            // For now, we'll use a placeholder
            data = await getCourseLeaderboard("course-id");
            break;
          case "monthly":
            data = await getMonthlyLeaderboard();
            break;
          default:
            data = await getGlobalLeaderboard();
        }
        setLeaderboard(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [view]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

      <div className="flex space-x-4 mb-8">
        <Button
          variant={view === "global" ? "default" : "outline"}
          onClick={() => setView("global")}
        >
          Global
        </Button>
        <Button
          variant={view === "course" ? "default" : "outline"}
          onClick={() => setView("course")}
        >
          Course
        </Button>
        <Button
          variant={view === "monthly" ? "default" : "outline"}
          onClick={() => setView("monthly")}
        >
          Monthly
        </Button>
      </div>

      <div className="grid gap-6">
        {leaderboard.map((entry, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-500">
                  #{entry.rank}
                </span>
                <img
                  src={entry.profilePicture}
                  alt={entry.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{entry.name}</h3>
                  <p className="text-sm text-gray-500">Level {entry.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{entry.points} points</p>
                {view === "course" && (
                  <p className="text-sm text-gray-500">
                    Progress: {entry.progress}%
                  </p>
                )}
                {view === "monthly" && (
                  <p className="text-sm text-gray-500">
                    Monthly Progress: {entry.monthlyProgress}%
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
