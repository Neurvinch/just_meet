import React from "react";
import { useNavigate } from "react-router-dom";
import landingImage from "../assets/tup.png"; // Your image

const Landing = () => {
  const navigate = useNavigate();

  const goToCreateMeeting = () => {
    navigate("/home"); // Redirects to Home Page (WebRTC)
  };

  return (
    <div className="landing-container">
      <h1>Welcome to WebRTC Live Streaming</h1>
      <p>Click the image to start a live stream</p>
      
      <img 
        src={landingImage} 
        alt="Live Streaming" 
        className="landing-image" 
        onClick={goToCreateMeeting} 
      />
    </div>
  );
};

export default Landing;
