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
<<<<<<< HEAD

=======
import Login from "./Pages/Login";
import DrawingBoard from "./components/DrawBoard";
>>>>>>> 7378f911a14599b86fd33db2c3f6a1f093f6e4b7

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/pixelauthpage" element={<PixelAuthPage />} />
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
<<<<<<< HEAD
        <Route path="/login" element={<PixelAuthPage />} /> {/* ✅ Made lowercase */}
=======
        <Route path="/login" element={<Login />} /> 
        <Route path = "/board"   element={<DrawingBoard/>} />
>>>>>>> 7378f911a14599b86fd33db2c3f6a1f093f6e4b7
      </Routes>
    </Router>
  );

}

export default App;
