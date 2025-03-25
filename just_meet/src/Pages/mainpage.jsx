import React from 'react';
import { motion } from 'framer-motion';

// Placeholder images (you'll want to replace these with actual speaker images)
const speakers = [
   {
      name: 'Regina',
      role: 'Storyteller',
      image: '/.png',
      description: 'Weaving narratives that captivate and inspire, Regina brings stories to life with her unique storytelling approach.'
   }
];

const Mainpage = () => {
   return (
    <div
    className="min-h-screen bg-black p-50 text-white  font-['Press_Start_2P']   "
  >
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto flex bg-black/70 p-6 rounded-lg"
    >
      <div className="w-1/3 pr-8 space-y-4 ml-20">
        <h1 className="text-4xl font-bold mb-6 uppercase tracking-tighter">
          Meet <span className="text-lime-500">Graeter's</span> Innovators
        </h1>
        <p className="text-sm text-gray-300 mb-4">
          Discover the passionate individuals behind Graeter's innovative spirit.
          Each team member brings a unique perspective and expertise that drives
          our creative vision forward.
        </p>
        <div className="bg-lime-500/10 p-4 rounded-lg">
          <h2 className="text-xl text-lime-500 mb-2">Our Collective Vision</h2>
          <p className="text-xs text-gray-300">
            We believe in pushing boundaries, embracing creativity, and creating
            meaningful experiences that inspire and connect.
          </p>
        </div>
      </div>
  
      <div className="w-1/2 h-[600px] grid grid-cols-1 gap-20">
        {speakers.map((speaker, index) => (
          <motion.div
            key={speaker.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.2,
              duration: 0.5,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            className="bg-gray-900/80 rounded-lg overflow-hidden shadow-2xl flex flex-col ml-40"
          >
            <img src={speaker.image} alt={speaker.name} className="w-full h-96 object-cover" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
   )  
};

export default Mainpage;