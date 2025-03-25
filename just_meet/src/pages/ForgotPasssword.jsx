import axios from "axios";
import React, { useState } from "react";

import { toast } from "react-toastify";
import { 
  FaEnvelope, 
  FaLock, 
  FaPaperPlane, 
  FaCheckCircle 
} from "react-icons/fa";
import { motion } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [fPCode, setFPCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("send");
  const [showPassword, setShowPassword] = useState(false);

  

  const sendForgotPasswordCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/sendForgotPassCode`, {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setStep("verify");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const verifyForgotPasswordCode = async (e) => {
    e.preventDefault();
    if (!email || !fPCode || !newPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/verifyForgotPassCode`, {
        email,
        providedCode: fPCode,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {step === "send" ? "Forgot Password" : "Verify Code"}
          </h1>
        </div>

        <form 
          onSubmit={step === "send" ? sendForgotPasswordCode : verifyForgotPasswordCode}
          className="p-8 space-y-6"
        >
          {step === "send" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" /> Send Verification Code
              </button>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={fPCode}
                  onChange={(e) => setFPCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 flex items-center justify-center"
              >
                <FaCheckCircle className="mr-2" /> Verify and Reset Password
              </button>
            </motion.div>
          )}
        </form>

        <div className="px-8 pb-8 text-center">
          <p 
            onClick={() => navigate("/login")} 
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Remember your password? Login
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;