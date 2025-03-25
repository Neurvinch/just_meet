import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const PixelAuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "signup" : "login";
      const dataToSend = isSignup
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { name: formData.name, password: formData.password };

      const res = await axios.post(`${apiUrl}/api/${endpoint}`, dataToSend);

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        console.log(`${isSignup ? "Signup" : "Login"} Successful`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
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
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${isSignup ? 'bg-yellow-300 text-black' : 'text-gray-400'}`}
                  onClick={() => setIsSignup(true)}
                >Sign Up</button>
                <button 
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${!isSignup ? 'bg-yellow-300 text-black' : 'text-gray-400'}`}
                  onClick={() => setIsSignup(false)}
                >Sign In</button>
              </div>
            </div>
            <form className="space-y-6 pixel-font text-sm" onSubmit={handleSubmit}>
              {isSignup && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" 
                  required
                />
              )}
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                className="w-full bg-yellow-400 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
                disabled={loading}
              >{loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}</button>
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelAuthPage;
