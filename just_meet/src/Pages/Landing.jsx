import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import landingImage from "/p4.png"; // Your image
=======
import landingImage from "/money.png"; // Your image
>>>>>>> c59185d190828875deff76239ad2aab978ae3c76

const Landing = () => {
  const navigate = useNavigate();

  const goToCreateMeeting = () => {
    navigate("/"); // Redirects to Home Page (WebRTC)
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
