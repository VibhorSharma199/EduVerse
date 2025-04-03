import React, { useState, useEffect } from "react";
import { getMentors } from "../api/mentor";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await getMentors();
        setMentors(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">Our Mentors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <Card key={mentor._id} className="p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={mentor.profilePicture}
                alt={mentor.name}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
              <p className="text-gray-600 mb-4">{mentor.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between w-full mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-semibold">{mentor.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="font-semibold">{mentor.points}</p>
                </div>
              </div>

              <Link to={`/mentors/${mentor._id}`}>
                <Button variant="outline">View Profile</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Mentors;
