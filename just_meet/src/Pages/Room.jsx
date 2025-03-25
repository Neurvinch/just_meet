import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import VideoPlayer from "../components/VideoPlayer";
import ChatBox from "../components/ChatBox";
import FileShare from "../components/FileShare";

const socket = io("http://localhost:5000");

const Room = () => {
  const { roomId } = useParams();

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <VideoPlayer />
      <ChatBox socket={socket} />
      <FileShare socket={socket} />
    </div>
  );
};

export default Room;
