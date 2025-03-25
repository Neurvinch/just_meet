import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Polling = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    socket.on('initPolls', (initialPolls) => setPolls(initialPolls));
    socket.on('pollUpdate', (updatedPolls) => setPolls(updatedPolls));
    return () => {
      socket.off('initPolls');
      socket.off('pollUpdate');
    };
  }, []);

  const vote = (pollId, optionIndex) => {
    socket.emit('vote', { pollId, optionIndex });
  };

  return (
    <div>
      <h2>Polls</h2>
      {polls.map((poll) => (
        <div key={poll._id}>
          <h3>{poll.question}</h3>
          {poll.options.map((opt, idx) => (
            <button key={idx} onClick={() => vote(poll._id, idx)}>
              {opt.text} ({opt.votes})
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Polling;