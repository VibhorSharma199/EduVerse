import React from "react";
import { Link } from "react-router-dom";
// ...existing imports...

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo or brand */}
        <div className="text-xl font-bold text-purple-700">Learn-F</div>
        {/* Navigation links */}
        <ul className="flex space-x-4">
          {/* ...existing links... */}
          <li>
            <Link to="/" className="text-gray-700 hover:text-purple-700">
              Home
            </Link>
          </li>
          <li>
            <Link to="/quizes" className="text-gray-700 hover:text-purple-700">
              Quizzes
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-purple-700"
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
