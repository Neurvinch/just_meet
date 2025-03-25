import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from "./Pages/mainpage";
import Landing from "./Pages/Landing";
import EnvironmentPage from "./Pages/environment";
import PixelAuthPage from './Pages/lg';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage/>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/environment" element={<EnvironmentPage />} />
        <Route path="/login" element={<PixelAuthPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
