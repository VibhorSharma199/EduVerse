import React, { useState } from 'react';
import { FaGoogle, FaApple, FaMicrosoft, FaEye, FaEyeSlash, FaGraduationCap, FaBook, FaUserGraduate } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  // This component remains your main export
  return <SignupComponent />;
};

// Signup Component
const SignupComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'student',
    agreeTerms: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Signup successful:', formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <FaGraduationCap className="text-purple-700 text-4xl mr-2" />
            <h1 className="text-4xl font-bold text-purple-700">EduSphere</h1>
          </div>
          <p className="text-lg text-gray-700">Begin Your Learning Journey</p>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <Link to="/login" className="px-6 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition">
            Login
          </Link>
          <button className="px-6 py-2 bg-purple-700 text-white rounded-lg">Sign Up</button>
        </div>
        
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Create Your Account</h2>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => console.log('Google signup')}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaGoogle className="text-purple-700" />
          </button>
          <button 
            onClick={() => console.log('Apple signup')}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaApple className="text-purple-700" />
          </button>
          <button 
            onClick={() => console.log('Microsoft signup')}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaMicrosoft className="text-purple-700" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@edusphere.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountType">
              I am a
            </label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300 pr-10"
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-purple-700"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300 pr-10"
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-purple-700"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                className="form-checkbox h-4 w-4 text-purple-700 focus:ring-purple-500"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-700">
                I agree to the <a href="#" className="text-purple-700 hover:underline">Terms</a> and <a href="#" className="text-purple-700 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-700 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
      
      {/* Right Section */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center">
        <div className="text-white p-12 max-w-md">
          <FaBook className="text-5xl mb-6 text-purple-300" />
          <h2 className="text-4xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-lg text-purple-200 mb-8">
            Join thousands of students advancing their skills with our interactive courses.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-purple-600 p-2 rounded-full mr-4">
                <FaUserGraduate className="text-purple-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Interactive Courses</h3>
                <p className="text-purple-200">Engaging content with hands-on projects</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-600 p-2 rounded-full mr-4">
                <FaGraduationCap className="text-purple-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Progress Tracking</h3>
                <p className="text-purple-200">Monitor your learning journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Component (in same file but not exported)
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login successful');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <FaGraduationCap className="text-purple-700 text-4xl mr-2" />
            <h1 className="text-4xl font-bold text-purple-700">EduSphere</h1>
          </div>
          <p className="text-lg text-gray-700">Unlock Your Learning Potential</p>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <button className="px-6 py-2 bg-purple-700 text-white rounded-lg">Login</button>
          <Link to="/signup" className="px-6 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition">
            Sign Up
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Welcome Back!</h2>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => console.log('Google login')}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaGoogle className="text-purple-700" />
          </button>
          <button 
            onClick={() => console.log('Apple login')}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaApple className="text-purple-700" />
          </button>
          <button 
            onClick={() => console.log('Microsoft login')}
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaMicrosoft className="text-purple-700" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-email">
              Email
            </label>
            <input
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@edusphere.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-300 pr-10"
                id="login-password"
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-purple-700"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="mb-6 flex justify-between">
            <label className="flex items-center">
              <input
                className="form-checkbox h-4 w-4 text-purple-700 focus:ring-purple-500"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-purple-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
      {/* Right Section */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center">
        <div className="text-white p-12 max-w-md">
          <FaUserGraduate className="text-5xl mb-6 text-purple-300" />
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-purple-200 mb-8">
            Access thousands of courses and track your learning progress.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-purple-600 p-2 rounded-full mr-4">
                <FaBook className="text-purple-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Personalized Learning</h3>
                <p className="text-purple-200">Courses tailored to your goals</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-600 p-2 rounded-full mr-4">
                <FaGraduationCap className="text-purple-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Expert Instructors</h3>
                <p className="text-purple-200">Learn from industry professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;