import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Polling = () => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] });

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

  const handlePollSubmit = (e) => {
    e.preventDefault();
    if (newPoll.question && newPoll.options.every(opt => opt.trim())) {
      fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newPoll.question,
          options: newPoll.options.map(text => ({ text })),
        }),
      })
        .then(() => {
          setNewPoll({ question: '', options: ['', ''] });
        })
        .catch(err => console.error('Failed to create poll:', err));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Polls</h2>
      {polls.map((poll) => (
        <div key={poll._id} style={{ marginBottom: '20px' }}>
          <h3>{poll.question}</h3>
          {poll.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => vote(poll._id, idx)}
              style={{ margin: '5px', padding: '5px 10px' }}
            >
              {opt.text} ({opt.votes})
            </button>
          ))}
        </div>
      ))}
      <form onSubmit={handlePollSubmit}>
        <input
          value={newPoll.question}
          onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
          placeholder="Poll question"
          style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
        />
        {newPoll.options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={(e) => {
              const newOptions = [...newPoll.options];
              newOptions[idx] = e.target.value;
              setNewPoll({ ...newPoll, options: newOptions });
            }}
            placeholder={`Option ${idx + 1}`}
            style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
          />
        ))}
        <button type="submit" style={{ padding: '5px 10px' }}>Create Poll</button>
      </form>
    </div>
  );
};

export default Polling;