import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoomId = uuidV4();
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div>
      <h2>WebRTC Live Stream</h2>
      <button onClick={createRoom}>Create Room</button>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={() => navigate(`/room/${roomId}`)}>Join Room</button>
    </div>
  );
};

export default Home;
