
import './App.css'
import Announcements from './pages/Announcements'
import Chat from './pages/Chat'
//import ForgotPassword from './pages/ForgotPasssword'
import Login from './pages/Login'
import Payement from './pages/Payement'
import Polling from './pages/Polling'
import Register from './pages/Register'
import TaskBoard from './pages/TaskBoard'
import TaskList from './pages/TaskList'

function App() {


  return (
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
}

export default App
