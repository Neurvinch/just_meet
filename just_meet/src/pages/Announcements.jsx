import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    socket.on('initAnnouncements', (initialAnnouncements) => setAnnouncements(initialAnnouncements));
    socket.on('announcementUpdate', (updatedAnnouncements) => setAnnouncements(updatedAnnouncements));
    return () => {
      socket.off('initAnnouncements');
      socket.off('announcementUpdate');
    };
  }, []);

  return (
    <div>
      <h2>Announcements</h2>
      {announcements.map((ann) => (
        <div key={ann._id}>
          <h4>{ann.title}</h4>
          <p>{ann.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;