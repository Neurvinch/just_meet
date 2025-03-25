import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const TaskBoard = () => {
  const [columns, setColumns] = useState({
    todo: { name: 'To Do', tasks: [] },
    inProgress: { name: 'In Progress', tasks: [] },
    done: { name: 'Done', tasks: [] },
  });
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = prompt('Enter your username:') || 'Anonymous';
    setUsername(user);

    socket.on('initTasks', (initialTasks) => {
      setColumns({
        todo: { name: 'To Do', tasks: initialTasks.filter(t => t.status === 'todo') },
        inProgress: { name: 'In Progress', tasks: initialTasks.filter(t => t.status === 'inProgress') },
        done: { name: 'Done', tasks: initialTasks.filter(t => t.status === 'done') },
      });
    });

    socket.on('taskUpdate', (updatedTasks) => {
      setColumns({
        todo: { name: 'To Do', tasks: updatedTasks.filter(t => t.status === 'todo') },
        inProgress: { name: 'In Progress', tasks: updatedTasks.filter(t => t.status === 'inProgress') },
        done: { name: 'Done', tasks: updatedTasks.filter(t => t.status === 'done') },
      });
    });

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
        body: JSON.stringify({ ...newTask, createdBy: username, status: 'todo' }),
      })
        .then(() => setNewTask({ title: '', description: '' }))
        .catch(err => console.error('Failed to create task:', err));
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceTasks = [...sourceCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId; // Update status
    const destTasks = [...destCol.tasks];
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = {
      ...columns,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks },
    };
    setColumns(newColumns);

    // Send updated tasks to server
    const allTasks = Object.values(newColumns).flatMap(col => col.tasks);
    socket.emit('taskMoved', allTasks);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Task Board</h2>
      <form onSubmit={createTask} style={{ marginBottom: '20px' }}>
        <input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <input
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Add Task</button>
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {Object.entries(columns).map(([id, col]) => (
            <Droppable droppableId={id} key={id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: '250px',
                    padding: '10px',
                    background: '#f0f0f0',
                    minHeight: '300px',
                  }}
                >
                  <h3>{col.name}</h3>
                  {col.tasks.map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: '10px',
                            background: 'white',
                            marginBottom: '10px',
                            border: '1px solid #ddd',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{task.title}</strong>
                          <p>{task.description}</p>
                          <small>By: {task.createdBy}</small>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;