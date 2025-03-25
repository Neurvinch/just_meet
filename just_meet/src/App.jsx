<<<<<<< HEAD
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from "./Pages/mainpage";
import Landing from "./Pages/Landing";
import EnvironmentPage from "./Pages/environment";
import PixelAuthPage from './Pages/lg';
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Mainpage from "./Pages/mainpage";
import Landing from "./Pages/Landing";
import EnvironmentPage from "./Pages/environment";
import PixelAuthPage from "./Pages/PixelAuthPage";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
>>>>>>> b46b1745a0f86b2c7a80c1f207c441d51cb486c6

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Mainpage/>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/login" element={<PixelAuthPage/>} />
=======
        <Route path="/" element={<Mainpage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/PixelAuthPage" element={<PixelAuthPage />} /> {/* ✅ Fixed Path */}
        <Route path="/Home" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />

>>>>>>> b46b1745a0f86b2c7a80c1f207c441d51cb486c6
      </Routes>
    </Router>
  );
}

export default App;
