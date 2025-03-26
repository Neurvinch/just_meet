import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  ScreenShare, 
  StopCircle,
  X 
} from "lucide-react";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
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
      setIsScreenSharing(true);

      // When screen sharing ends
      screenStream.getVideoTracks()[0].onended = () => {
        // Revert back to camera stream
        videoRef.current.srcObject = stream;
        setIsScreenSharing(false);
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  // Handle Cancel and Navigate to Room
  const handleCancel = () => {
    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Navigate to room page
    navigate('/room');
  };

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden relative">
        {/* Cancel Button */}
        <button 
          onClick={handleCancel}
          className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300"
          title="Cancel and Return to Room"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay when video/audio is disabled */}
          {(!videoEnabled || !audioEnabled) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              {!videoEnabled && <CameraOff className="w-24 h-24 text-white" />}
              {!audioEnabled && <MicOff className="w-24 h-24 text-white" />}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 p-4 bg-gray-700">
          {/* Mute Toggle */}
          <button 
            onClick={toggleMute} 
            className={`
              p-3 rounded-full transition-all duration-300 
              ${audioEnabled 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'}
              text-white flex items-center justify-center
            `}
            title={audioEnabled ? "Mute" : "Unmute"}
          >
            {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Camera Toggle */}
          <button 
            onClick={toggleVideo} 
            className={`
              p-3 rounded-full transition-all duration-300 
              ${videoEnabled 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'}
              text-white flex items-center justify-center
            `}
            title={videoEnabled ? "Turn Camera Off" : "Turn Camera On"}
          >
            {videoEnabled ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
          </button>

          {/* Screen Share */}
          <button 
            onClick={shareScreen} 
            className={`
              p-3 rounded-full transition-all duration-300 
              ${isScreenSharing 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-blue-500 hover:bg-blue-600'}
              text-white flex items-center justify-center
            `}
            title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
          >
            {isScreenSharing 
              ? <StopCircle className="w-6 h-6" /> 
              : <ScreenShare className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;