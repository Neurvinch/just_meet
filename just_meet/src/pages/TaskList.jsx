import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [username, setUsername] = useState('');

  // Set username once on mount
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
    if (newTask.title.trim() && username) {
      fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, createdBy: username }),
      })
        .then(() => setNewTask({ title: '', description: '' }))
        .catch(err => console.error('Failed to create task:', err));
    }
  };

  const updateStatus = (taskId, status) => {
    socket.emit('updateTaskStatus', { taskId, status });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Task List</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {tasks.map((task) => (
          <div key={task._id} style={{ marginBottom: '10px', padding: '5px', background: '#f9f9f9' }}>
            <strong>{task.title}</strong> by {task.createdBy}
            <p>{task.description}</p>
            <select
              value={task.status}
              onChange={(e) => updateStatus(task._id, e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>
      <form onSubmit={createTask} style={{ marginTop: '10px' }}>
        <input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
        <input
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Add Task</button>
      </form>
    </div>
  );
};

export default TaskList;