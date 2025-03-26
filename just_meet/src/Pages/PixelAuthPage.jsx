import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Background images with random positioning
  const backgroundImages = [
    { src: "/p1.png", top: "top-10", left: "left-5" },
    { src: "/p2.webp", top: "top-1/4", right: "right-10" },
    { src: "/p3.jpg", bottom: "bottom-20", left: "left-1/3" },
    { src: "/p5.png", top: "top-1/2", right: "right-1/4" },
    { src: "/p6.png", bottom: "bottom-10", right: "right-1/3" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignup) {
        // Registration: Ensure all fields are filled
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please fill all fields");
          setLoading(false);
          return;
        }
        const res = await axios.post(`${apiUrl}/api/register`, formData);
        if (res.data.success) {
          setSuccess(res.data.message || "Registration successful!");
          setFormData({ name: '', email: '', password: '' });
        } else {
          setError("Registration failed");
        }
      } else {
        // Login: Only require name and password
        if (!formData.name || !formData.password) {
          setError("Please fill all fields");
          setLoading(false);
          return;
        }
        const loginData = { name: formData.name, password: formData.password };
        const res = await axios.post(`${apiUrl}/api/login`, loginData);
        if (res.data.success) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          setSuccess("Login successful!");
            navigate("/environment")
        } else {
          setError("Login failed");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full opacity-10">
          {[...Array(144)].map((_, index) => (
            <div 
              key={index} 
              className="border border-gray-300 dark:border-gray-700"
            ></div>
          ))}
        </div>
      </div>

      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index} 
          className={`absolute ${image.top || ''} ${image.bottom || ''} ${image.left || ''} ${image.right || ''} opacity-20 z-0`}
        >
          <img 
            src={image.src} 
            alt={`Background image ${index + 1}`} 
            className="rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-300 w-30 h-30"
          />
        </div>
      ))}

      {/* Auth Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
            <img src="/pp.webp" alt="Auth Illustration" className="w-40 h-40" />
          </div>
          
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 pt-24 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white pixel-font tracking-wider">Just_meet</h1>
            </div>
            
            <div className="flex justify-center mb-8 pixel-font">
              <div className="bg-gray-800 rounded-full p-1 flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${isSignup ? 'bg-green-500 text-black' : 'text-gray-400'}`}
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
                <button
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${!isSignup ? 'bg-green-500 text-black' : 'text-gray-400'}`}
                  onClick={() => setIsSignup(false)}
                >
                  Sign In
                </button>
              </div>
            </div>
            
            <form className="space-y-6 pixel-font text-sm" onSubmit={handleSubmit}>
              {isSignup && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </>
              )}

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
              
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              
              <button
                type="submit"
                className="w-full bg-green-500 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
              </button>
              <a href="/forgotPasssword"
               className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              > Forgot Password ?</a>
              
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
              {success && <p className="text-green-500 text-center mt-2">{success}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
