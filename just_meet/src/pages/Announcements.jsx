import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = prompt('Enter your username:') || 'Anonymous';
    setUsername(user);

    socket.on('initAnnouncements', (initialAnnouncements) => {
      setAnnouncements(initialAnnouncements);
    });

    socket.on('announcementUpdate', (updatedAnnouncements) => {
      setAnnouncements(updatedAnnouncements);
    });

    return () => {
      socket.off('initAnnouncements');
      socket.off('announcementUpdate');
    };
  }, []);

  const createAnnouncement = (e) => {
    e.preventDefault();
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim() && username) {
      socket.emit('createAnnouncement', {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        createdBy: username,
      });
      setNewAnnouncement({ title: '', content: '' });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Announcements</h2>
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          background: '#f9f9f9',
        }}
      >
        {announcements.map((ann) => (
          <div key={ann._id} style={{ marginBottom: '10px' }}>
            <strong>{ann.title}</strong> by {ann.createdBy}
            <p>{ann.content}</p>
            <small>{new Date(ann.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={createAnnouncement} style={{ marginTop: '10px' }}>
        <input
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
          placeholder="Announcement title"
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
        />
        <textarea
          value={newAnnouncement.content}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
          placeholder="Announcement content"
          style={{ width: '100%', padding: '5px', marginBottom: '5px', minHeight: '60px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Post Announcement</button>
      </form>
    </div>
  );
};

export default Announcements;