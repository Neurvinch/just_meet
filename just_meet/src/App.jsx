import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Mainpage from "./Pages/Mainpage";
import Landing from "./Pages/Landing";
import EnvironmentPage from "./Pages/Environment";
import PixelAuthPage from "./Pages/PixelAuthPage";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
import Chatbot from "./Pages/Chatbot";
import Payment from "./Pages/Payement";
import Games from './components/GameSelector';
import WhackAMole from './components/WhackAMole';
import Game2048 from './components/Game2048';
import MathGame from './components/MathGame';
import SlidePuzzle from './components/SlidePuzzle';
import TreasureToss from './components/TreasureToss';
import Login from "./Pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/pixelauthpage" element={<PixelAuthPage />} /> {/* ✅ Path fixed */}
        <Route path="/home" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/pay" element={<Payment />} />
        <Route path="/games" element={<Games />} />
        <Route path="/whackamole" element={<WhackAMole />} />
        <Route path="/game2048" element={<Game2048 />} />
        <Route path="/math" element={<MathGame />} />
        <Route path="/slide" element={<SlidePuzzle />} />
        <Route path="/treasure" element={<TreasureToss />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Made lowercase */}
      </Routes>
    </Router>
  );
}

export default App;
