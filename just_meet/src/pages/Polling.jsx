import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from "lucide-react";

const PixelPolling = () => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });
  const [loading, setLoading] = useState(false);

  // Background images with random positioning
  const backgroundImages = [
    { src: "/p1.png", top: "top-10", left: "left-5" },
    { src: "/p2.webp", top: "top-1/4", right: "right-10" },
    { src: "/p3.jpg", bottom: "bottom-20", left: "left-1/3" },
    { src: "/p5.png", top: "top-1/2", right: "right-1/4" },
    { src: "/p6.png", bottom: "bottom-10", right: "right-1/3" }
  ];

  // Fetch polls on component mount
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polls');
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      }
    };

    fetchPolls();
  }, []);

  const vote = async (pollId, optionIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex })
      });
      const updatedPoll = await response.json();
      
      // Update the polls state with the updated poll
      setPolls(polls.map(poll => 
        poll._id === pollId ? updatedPoll : poll
      ));
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handlePollSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (newPoll.question && newPoll.options.every(opt => opt.trim())) {
      try {
        const response = await fetch('http://localhost:5000/api/polls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: newPoll.question,
            options: newPoll.options.map(text => ({ text })),
          }),
        });
        
        const createdPoll = await response.json();
        setPolls([...polls, createdPoll]);
        setNewPoll({ question: '', options: ['', ''] });
      } catch (error) {
        console.error('Failed to create poll:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addOption = () => {
    setNewPoll({ 
      ...newPoll, 
      options: [...newPoll.options, ''] 
    });
  };

  const removeOption = (indexToRemove) => {
    if (newPoll.options.length > 2) {
      setNewPoll({
        ...newPoll,
        options: newPoll.options.filter((_, index) => index !== indexToRemove)
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden pixel-font">
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

      {/* Polling Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
            <img src="/pp.webp" alt="Polling Illustration" className="w-40 h-40" />
          </div>
          
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 pt-24 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white tracking-wider">Just_Poll</h1>
            </div>
            
            {/* Poll Creation Form */}
            <form className="space-y-6 text-sm" onSubmit={handlePollSubmit}>
              <input
                type="text"
                placeholder="Poll Question"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              
              {newPoll.options.map((opt, idx) => (
                <div key={idx} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[idx] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    className="flex-grow p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                  {newPoll.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="bg-red-500 text-black p-3 rounded-lg hover:bg-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <div className="flex justify-between space-x-2">
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center bg-green-500 text-black p-3 rounded-lg hover:bg-green-400 transition-colors"
                >
                  <Plus className="mr-2 w-5 h-5" /> Add Option
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-green-500 text-black p-3 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Poll"}
                </button>
              </div>
            </form>

            {/* Existing Polls */}
            <div className="mt-8 space-y-4">
              {polls.map((poll) => (
                <div 
                  key={poll._id} 
                  className="bg-gray-900 rounded-lg border-2 border-white p-4"
                >
                  <h2 className="text-white text-lg mb-4">{poll.question}</h2>
                  <div className="space-y-2">
                    {poll.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => vote(poll._id, idx)}
                        className="w-full p-3 bg-black border-2 border-white text-white rounded-lg 
                          hover:bg-green-500 hover:text-black transition-colors 
                          flex justify-between items-center"
                      >
                        <span>{opt.text}</span>
                        <span className="ml-2 text-gray-400">{opt.votes} votes</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelPolling;