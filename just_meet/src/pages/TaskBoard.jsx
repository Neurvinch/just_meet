import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { Trash2, Move, Archive } from 'lucide-react';

const socket = io('http://localhost:5000');

const TaskBoard = () => {
  const [columns, setColumns] = useState({
    todo: { name: 'To Do', tasks: [] },
    inProgress: { name: 'In Progress', tasks: [] },
    done: { name: 'Done', tasks: [] },
  });
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [username, setUsername] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const navigate = useNavigate();

  // Background images similar to AuthPage
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

    return () => {
      socket.off('initTasks');
      socket.off('taskUpdate');
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

  const deleteTask = (taskId) => {
    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    .then(() => {
      // Remove task from local state
      const newColumns = { ...columns };
      Object.keys(newColumns).forEach(colKey => {
        newColumns[colKey].tasks = newColumns[colKey].tasks.filter(task => task._id !== taskId);
      });
      setColumns(newColumns);
    })
    .catch(err => console.error('Failed to delete task:', err));
  };

  const moveTask = (task, targetColumn) => {
    // Remove task from current column
    const newColumns = { ...columns };
    Object.keys(newColumns).forEach(colKey => {
      newColumns[colKey].tasks = newColumns[colKey].tasks.filter(t => t._id !== task._id);
    });

    // Add task to target column
    task.status = targetColumn;
    newColumns[targetColumn].tasks.push(task);
    
    setColumns(newColumns);
    setSelectedTask(null);

    // Send updated tasks to server
    fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetColumn }),
    }).catch(err => console.error('Failed to move task:', err));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceTasks = [...sourceCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    const destTasks = [...destCol.tasks];
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = {
      ...columns,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks },
    };
    setColumns(newColumns);

    const allTasks = Object.values(newColumns).flatMap(col => col.tasks);
    socket.emit('taskMoved', allTasks);
  };
      
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
              Enter into the Task Boards
            </button>
          </form>
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Grid and Background Images (same as previous version) */}
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

      {/* Task Board Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl relative">
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white pixel-font tracking-wider">Just_meet Tasks</h1>
            </div>

            {/* Task Creation Form */}
            <form 
              onSubmit={createTask} 
              className="mb-8 flex space-x-4 pixel-font text-sm"
            >
              <input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="flex-grow p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                className="flex-grow p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit" 
                className="bg-green-500 text-black px-4 py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
              >
                Add Task
              </button>
            </form>

            {/* Move Task Modal */}
            {selectedTask && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-900 p-6 rounded-lg border-2 border-white">
                  <h2 className="text-white text-xl mb-4">Move Task</h2>
                  <div className="flex space-x-4">
                    {Object.keys(columns).map(colKey => (
                      colKey !== selectedTask.status && (
                        <button
                          key={colKey}
                          onClick={() => moveTask(selectedTask, colKey)}
                          className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Move to {columns[colKey].name}
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Drag and Drop Board */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(columns).map(([id, col]) => (
                  <Droppable droppableId={id} key={id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-gray-800 rounded-lg p-4 min-h-[400px]"
                      >
                        <h3 className="text-white pixel-font text-xl mb-4">{col.name}</h3>
                        {col.tasks.map((task, index) => (
                          <Draggable 
                            draggableId={task._id} 
                            index={index} 
                            key={task._id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-black border-2 border-white rounded-lg p-4 mb-4 text-white pixel-font relative group"
                              >
                                <strong className="block mb-2">{task.title}</strong>
                                <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                                <small className="text-xs text-green-500">By: {task.createdBy}</small>
                                
                                {/* Task Actions */}
                                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setSelectedTask(task)}
                                    className="text-white hover:text-green-500"
                                    title="Move Task"
                                  >
                                    <Move size={16} />
                                  </button>
                                  <button 
                                    onClick={() => deleteTask(task._id)}
                                    className="text-white hover:text-red-500"
                                    title="Delete Task"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
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
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;