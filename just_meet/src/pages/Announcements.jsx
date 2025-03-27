import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Search } from "lucide-react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [username, setUsername] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('latest');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUsernameSet , setIsUsernameSet] = useState(false);

  // Background images with random positioning
  const backgroundImages = [
    { src: "/p1.png", top: "top-10", left: "left-5" },
    { src: "/p2.webp", top: "top-1/4", right: "right-10" },
    { src: "/p3.jpg", bottom: "bottom-20", left: "left-1/3" },
    { src: "/p5.png", top: "top-1/2", right: "right-1/4" },
    { src: "/p6.png", bottom: "bottom-10", right: "right-1/3" }
  ];

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const enteredUsername = e.target.username.value.trim();
    if (enteredUsername) {
      setUsername(enteredUsername || 'Anonymous');
      setIsUsernameSet(true);
    }
  };

  useEffect(() => {
    const user = prompt('Enter your username:') || 'Anonymous';
    setUsername(user);
  }, []);

  const createAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcementToSave = {
        _id: editingAnnouncement ? editingAnnouncement._id : Date.now().toString(),
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        createdBy: username,
        createdAt: editingAnnouncement ? editingAnnouncement.createdAt : new Date()
      };

      try {
        setAnnouncements(prev => {
          if (editingAnnouncement) {
            return prev.map(ann => 
              ann._id === editingAnnouncement._id ? announcementToSave : ann
            );
          }
          return [announcementToSave, ...prev];
        });

        // Reset form state
        setNewAnnouncement({ title: '', content: '' });
        setEditingAnnouncement(null);
        setIsFormOpen(false);
      } catch (error) {
        console.error('Failed to create announcement:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(ann => ann._id !== id));
  };

  const editAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content
    });
    setIsFormOpen(true);
  };

  const filteredAnnouncements = useCallback(() => {
    let filtered = announcements.filter(ann => 
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch(filterBy) {
      case 'latest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return filtered;
    }
  }, [announcements, searchTerm, filterBy]);


  if (!isUsernameSet) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
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

        <div className="relative z-10 w-full max-w-md bg-black border-4 border-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6 pixel-font">
            Enter Your Username
          </h2>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              required
              className="w-full p-3 bg-black border-2 border-white text-white rounded-lg pixel-font placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
            >
              Create Announcements
            </button>
          </form>
        </div>
      </div>
    );
  }

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

      {/* Announcements Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
            <img src="/pp.webp" alt="Announcements Illustration" className="w-40 h-40" />
          </div>
          
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 pt-24 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white tracking-wider">Community Hub</h1>
            </div>
            
            {/* Search and Filter */}
            <div className="flex space-x-2 mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search announcements"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 pl-10 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <select 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="p-3 bg-black border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="latest" className="bg-black">Latest</option>
                <option value="oldest" className="bg-black">Oldest</option>
              </select>
            </div>

            {/* Create Announcement Button */}
            <button
              onClick={() => {
                setEditingAnnouncement(null);
                setNewAnnouncement({ title: '', content: '' });
                setIsFormOpen(!isFormOpen);
              }}
              className="w-full bg-green-500 text-black p-3 rounded-lg hover:bg-green-400 transition-colors mb-6 flex items-center justify-center"
            >
              <Plus className="mr-2 w-5 h-5" /> New Announcement
            </button>

            {/* Announcement Form */}
            {isFormOpen && (
              <form onSubmit={createAnnouncement} className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <textarea
                  placeholder="Announcement Content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white min-h-[120px]"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingAnnouncement(null);
                    }}
                    className="flex-grow bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow bg-green-500 text-black p-3 rounded-lg hover:bg-green-400 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Posting..." : (editingAnnouncement ? "Update" : "Post")}
                  </button>
                </div>
              </form>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              {filteredAnnouncements().length === 0 ? (
                <div className="text-center text-gray-500">No announcements found</div>
              ) : (
                filteredAnnouncements().map((ann) => (
                  <div 
                    key={ann._id} 
                    className="bg-gray-900 rounded-lg border-2 border-white p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-white text-lg font-bold">{ann.title}</h2>
                      <span className="text-sm text-gray-400">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{ann.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">By {ann.createdBy}</div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editAnnouncement(ann)}
                          className="text-green-500 hover:text-green-400 transition"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(ann._id)}
                          className="text-red-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;