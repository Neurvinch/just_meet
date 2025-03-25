import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  // Set username once on mount
  useEffect(() => {
    const user = prompt('Enter your username:') || 'Anonymous';
    setUsername(user);

    // Load initial messages
    socket.on('initMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    // Listen for new messages
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Debug connection
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('connect_error', (err) => console.error('Connection error:', err));

    // Cleanup
    return () => {
      socket.off('initMessages');
      socket.off('message');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && username) {
      socket.emit('sendMessage', { text: input, user: username });
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Chat Room</h2>
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          background: '#f9f9f9',
        }}
      >
        {messages.map((msg) => (
          <p key={msg._id} style={{ margin: '5px 0' }}>
            <strong>{msg.user}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '5px' }}
        />
        <button onClick={sendMessage} style={{ padding: '5px 10px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;