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

  useEffect(() => {
    socket.on('initTasks', (tasks) => {
      setColumns({
        todo: { name: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
        inProgress: { name: 'In Progress', tasks: tasks.filter(t => t.status === 'inProgress') },
        done: { name: 'Done', tasks: tasks.filter(t => t.status === 'done') },
      });
    });
    socket.on('taskUpdate', (tasks) => {
      setColumns({
        todo: { name: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
        inProgress: { name: 'In Progress', tasks: tasks.filter(t => t.status === 'inProgress') },
        done: { name: 'Done', tasks: tasks.filter(t => t.status === 'done') },
      });
    });
    return () => {
      socket.off('initTasks');
      socket.off('taskUpdate');
    };
  }, []);

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {Object.entries(columns).map(([id, col]) => (
          <Droppable droppableId={id} key={id } isDropDisabled={false}
            isCombineEnabled={false} ignoreContainerClipping={false}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ width: '200px', padding: '10px', background: '#f0f0f0' }}
              >
                <h2>{col.name}</h2>
                {col.tasks.map((task, index) => (
                  <Draggable draggableId={task._id} index={index} key={task._id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ padding: '8px', background: 'white', marginBottom: '8px', ...provided.draggableProps.style }}
                      >
                        {task.title}
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
  );
};

export default TaskBoard;