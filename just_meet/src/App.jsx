<<<<<<< HEAD
import './App.css'
<<<<<<< HEAD
import Announcements from './pages/Announcements'
import Chat from './pages/Chat'
//import ForgotPassword from './pages/ForgotPasssword'
import Login from './pages/Login'
import Payement from './pages/Payement'
import Polling from './pages/Polling'
import Register from './pages/Register'
import TaskBoard from './pages/TaskBoard'
import TaskList from './pages/TaskList'
=======
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
>>>>>>> ca4dcbc57ed9d7b65decb07ba5e70058486c7e11

function App() {
  return (
<<<<<<< HEAD
    <>
    {/* <ForgotPassword/> */}
    {/* <Payement/>
    <Register/> */}
    <Chat/>
    {/* <Announcements/>
    <TaskBoard/>
    <TaskList/>*/}
    <Polling/> 
  {/* <Login/> */}
    </>
  )
=======
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
>>>>>>> ca4dcbc57ed9d7b65decb07ba5e70058486c7e11
}

export default App;
