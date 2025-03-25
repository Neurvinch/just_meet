import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Mainpage from "./Pages/mainpage";
import Landing from "./Pages/Landing";
import EnvironmentPage from "./Pages/environment";
import PixelAuthPage from "./Pages/PixelAuthPage";
import Home from "./Pages/Home";
import Room from "./Pages/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/PixelAuthPage" element={<PixelAuthPage />} /> {/* ✅ Fixed Path */}
        <Route path="/Home" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />

      </Routes>
    </Router>
  );
}

export default App;
