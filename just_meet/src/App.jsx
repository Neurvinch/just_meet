import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Environment from './Pages/environment';
import PixelAuthPage from './Pages/lg';


function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Environment />} />
        <Route path="/auth" element={<PixelAuthPage />} />
        {/* <Route path="/login" element={<PixelAuthPage/>} /> */}
      </Routes>
    </Router>
  );
}

export default Main;
