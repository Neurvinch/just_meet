import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Globe, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mainpage = () => {
  const navigate = useNavigate(); 
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/nn.png" 
          alt="Creative background" 
          className="w-full h-full object-cover opacity-30"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-blue-900/60"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center text-center px-4">
        {/* Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -100,
                opacity: 0
              }}
              animate={{ 
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth,
                opacity: [0, 0.5, 0],
                rotate: 360
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
              className="absolute w-4 h-4 bg-lime-500/50 rounded-full"
            />
          ))}
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Unleash Your <span className="text-lime-500">Creative</span> Potential
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 mx-auto max-w-2xl">
            Dive into a world where innovation meets imagination. Transform your ideas into extraordinary experiences.
          </p>
          <div className="flex justify-center space-x-6">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-lime-500 text-black px-10 py-4 rounded-full font-bold hover:bg-lime-400 transition duration-300 flex items-center space-x-2"
            >
              <Rocket className="mr-2"     />
              Login
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/login')}
              className="border-2 border-white px-10 py-4 rounded-full hover:bg-white/10 transition duration-300 flex items-center space-x-2"
            >
              <Globe className="mr-2" />
              Explore
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Featured Section */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold mb-4">
              Meet Our <span className="text-lime-500">Innovators</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Our team is a collective of passionate creators, each bringing a unique vision and expertise that pushes the boundaries of creativity.
            </p>
            <div className="bg-lime-500/10 p-6 rounded-xl border-l-4 border-lime-500">
              <h3 className="text-2xl text-lime-500 mb-3 flex items-center">
                <Star className="mr-3 text-lime-500" />
                Our Vision
              </h3>
              <p className="text-gray-300">
                We believe in transforming challenges into opportunities, turning imagination into reality, and creating experiences that inspire and connect.
              </p>
            </div>
          </motion.div>

          {/* Speaker Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/60 rounded-2xl overflow-hidden shadow-2xl transform transition duration-300"
          >
            <div className="relative">
              <img
                src="/video.png"
                alt="Creative innovator"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h4 className="text-2xl font-bold text-lime-500 mb-2 flex items-center justify-center">
                  <Users className="mr-2" /> Regina
                </h4>
                <p className="text-gray-300 text-center">Storyteller & Creative Innovator</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;