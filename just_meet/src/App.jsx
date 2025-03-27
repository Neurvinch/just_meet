import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Mainpage from "./Pages/mainpage.jsx";
import Landing from "./Pages/Landing";
import EnvironmentPage from "./Pages/environment.jsx";
import PixelAuthPage from "./Pages/PixelAuthPage";
import Home from "./Pages/Home";
import Room from "./Pages/Room.jsx";
import Chatbot from "./Pages/Chatbot";
import Payment from  "./Pages/Payement.jsx";
import Games from './components/GameSelector';
import WhackAMole from './components/WhackAMole';
import Game2048 from './components/Game2048';
import MathGame from './components/MathGame';
import SlidePuzzle from './components/SlidePuzzle';
import TreasureToss from './components/TreasureToss';
import TaskBoard from './Pages/TaskBoard.jsx'


import DrawingBoard from "./components/DrawBoard";
import Chat from "./Pages/Chat";

import  PixelPolling from "./pages/Polling.jsx"
import Announcements from "./pages/Announcements";
import Signout from "./pages/Signout";
import ForgotPassword from "./pages/ForgotPasssword";
import TaskList  from "./pages/TaskList.jsx";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Mainpage/>} />
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
        <Route path="/login" element={<PixelAuthPage />} /> 
        <Route path = "/board"   element={<DrawingBoard/>} />
        <Route path = "/Chat"   element={<Chat/>} />
        <Route path="/ann" element={<Announcements/>}   />
        <Route path="/poll" element={< PixelPolling/>}   />
        <Route path="/signout" element={<Signout/>}  />
        <Route path="/TaskList" element={<TaskList/>}  />
        <Route path="/ann" element={<Announcements/>}   />
        <Route path="/taskboard" element={<TaskBoard/>}   />


        <Route path="/signout" element={<Signout/>}  />
        <Route path="forgotPasssword" element={<ForgotPassword/>}  />
      </Routes>
    </Router>
  );

}

export default App;
