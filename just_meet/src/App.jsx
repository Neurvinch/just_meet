
import Announcements from './pages/Announcements'
import Chat from './pages/Chat'
//import ForgotPassword from './pages/ForgotPasssword'
import Login from './pages/Login'
import Payement from './pages/Payement'
import Polling from './pages/Polling'
import Register from './pages/Register'
import TaskBoard from './pages/TaskBoard'
import TaskList from './pages/TaskList'

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
        <Route path="/" element={<Mainpage/>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/login" element={<PixelAuthPage/>} />
        <Route path = "/chat" element = {<Chat/>} />
        <Route path='/poll' element = {<Polling/>}   />

      </Routes>
    </Router>
  );

}

export default App;
