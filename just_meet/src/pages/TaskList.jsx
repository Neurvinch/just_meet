import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Plus, Check, Clock, List } from "lucide-react";

const socket = io('http://localhost:5000');

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Background images with random positioning
  const backgroundImages = [
    { src: "/p1.png", top: "top-10", left: "left-5" },
    { src: "/p2.webp", top: "top-1/4", right: "right-10" },
    { src: "/p3.jpg", bottom: "bottom-20", left: "left-1/3" },
    { src: "/p5.png", top: "top-1/2", right: "right-1/4" },
    { src: "/p6.png", bottom: "bottom-10", right: "right-1/3" }
  ];

  // Set username and socket listeners
  useEffect(() => {
    const user = prompt('Enter your username:') || 'Anonymous';
    setUsername(user);

    socket.on('initTasks', (initialTasks) => setTasks(initialTasks));
    socket.on('taskUpdate', (updatedTasks) => setTasks(updatedTasks));
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('connect_error', (err) => console.error('Connection error:', err));

    return () => {
      socket.off('initTasks');
      socket.off('taskUpdate');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  const createTask = (e) => {
    e.preventDefault();
    setLoading(true);

    if (newTask.title.trim() && username) {
      fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, createdBy: username }),
      })
      .then(() => {
        setNewTask({ title: '', description: '' });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to create task:', err);
        setLoading(false);
      });
    }
  };

  const updateStatus = (taskId, status) => {
    socket.emit('updateTaskStatus', { taskId, status });
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

      {/* Task List Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
            <img src="/pp.webp" alt="Tasks Illustration" className="w-40 h-40" />
          </div>
          
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 pt-24 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white tracking-wider flex items-center justify-center">
                <List className="mr-2" /> Task Hub
              </h1>
            </div>

            {/* Task Creation Form */}
            <form onSubmit={createTask} className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white min-h-[120px]"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-black p-3 rounded-lg hover:bg-green-400 transition-colors flex items-center justify-center"
                disabled={loading}
              >
                <Plus className="mr-2 w-5 h-5" /> 
                {loading ? "Adding Task..." : "Add Task"}
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center text-gray-500">No tasks yet</div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task._id} 
                    className="bg-gray-900 rounded-lg border-2 border-white p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-white text-lg font-bold">{task.title}</h2>
                      <span className="text-sm text-gray-400">By {task.createdBy}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{task.description}</p>
                    <div className="flex items-center space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        className="flex-grow p-2 bg-black border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <option value="todo" className="bg-black">To Do</option>
                        <option value="inProgress" className="bg-black">In Progress</option>
                        <option value="done" className="bg-black">Done</option>
                      </select>
                      {task.status === 'todo' && <Clock className="text-yellow-500 w-6 h-6" />}
                      {task.status === 'inProgress' && <Clock className="text-blue-500 w-6 h-6" />}
                      {task.status === 'done' && <Check className="text-green-500 w-6 h-6" />}
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

export default TaskList;