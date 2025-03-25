import React, { useRef, useEffect, useState } from "react";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    });
  }, []);

  // Toggle Mute/Unmute
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle Camera On/Off
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  // Start Screen Sharing
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      videoRef.current.srcObject = screenStream;
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <div>
        <button onClick={toggleMute}>{audioEnabled ? "Mute" : "Unmute"}</button>
        <button onClick={toggleVideo}>{videoEnabled ? "Turn Camera Off" : "Turn Camera On"}</button>
        <button onClick={shareScreen}>Share Screen</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
