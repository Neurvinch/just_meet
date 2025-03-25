import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on('initTasks', (initialTasks) => setTasks(initialTasks));
    socket.on('taskUpdate', (updatedTasks) => setTasks(updatedTasks));
    return () => {
      socket.off('initTasks');
      socket.off('taskUpdate');
    };
  }, []);

  return (
    <div>
      <h2>Task List</h2>
      {tasks.map((task) => (
        <div key={task._id}>{task.title} - {task.status}</div>
      ))}
    </div>
  );
};

export default TaskList;