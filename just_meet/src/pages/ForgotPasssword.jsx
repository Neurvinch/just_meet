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
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [fPCode, setFPCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("send");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4 py-8 pixelated-bg">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black w-full max-w-md border-4 border-=black rounded-lg overflow-hidden shadow-pixel"
      >
        <div className="bg-[#ffffff] p-4 text-center">
          <h1 className="text-2xl font-pixel text-[#000000] uppercase tracking-wider">
            {step === "send" ? "Forgot Password" : "Verify Code"}
          </h1>
        </div>

        <form 
          onSubmit={step === "send" ? sendForgotPasswordCode : verifyForgotPasswordCode}
          className="p-6 space-y-4"
        >
          {step === "send" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mb-4">
                <FaEnvelope className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#09c222]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-8 pr-2 py-2 bg-[#fcfcfc] text-[#066115] border-2 border-[#11500c] rounded-sm focus:outline-none pixel-input"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#ffffff] text-[#1a1a2e] py-2 rounded-sm hover:bg-[#ff6b81] transition duration-300 flex items-center justify-center font-pixel uppercase tracking-wider pixel-button"
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
              <div className="relative mb-4">
                <FaEnvelope className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#e94560]" />
                <input
                  type="text"
                  value={fPCode}
                  onChange={(e) => setFPCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                  className="w-full pl-8 pr-2 py-2 bg-[#0f3460] text-[#0dff6a] border-2 border-[#08ff45] rounded-sm focus:outline-none pixel-input"
                />
              </div>

              <div className="relative mb-4">
                <FaLock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#e94560]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full pl-8 pr-10 py-2 bg-[#0f3460] text-[#e94560] border-2 border-[#e94560] rounded-sm focus:outline-none pixel-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#e94560] hover:text-[#ff6b81]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fcfcfc] text-[#ffffff] py-2 rounded-sm hover:bg-[#7aff97] transition duration-300 flex items-center justify-center font-pixel uppercase tracking-wider pixel-button"
              >
                <FaCheckCircle className="mr-2" /> Verify and Reset Password
              </button>
            </motion.div>
          )}
        </form>

        <div className="px-6 pb-6 text-center">
          <p 
            onClick={() => navigate("/login")} 
            className="text-[#076607] hover:underline cursor-pointer font-pixel"
          >
            Remember your password? Login
          </p>
        </div>
      </motion.div>

      {/* Pixel-style background decoration */}
      <style jsx global>{`
        .pixelated-bg {
          background-image: 
            linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.8)),
            repeating-linear-gradient(0deg, transparent, transparent 1px, #1a1a2e 1px, #1a1a2e 2px);
        }

        .pixel-input {
          image-rendering: pixelated;
          box-shadow: 2px 2px 0 #0f3460;
        }

        .pixel-button {
          image-rendering: pixelated;
          box-shadow: 3px 3px 0 #0f3460;
          transition: all 0.2s;
        }

        .pixel-button:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 #0f3460;
        }

        .shadow-pixel {
          box-shadow: 8px 8px 0 #0f3460;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;