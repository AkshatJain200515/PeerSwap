import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import LearnMore from "./pages/LearnMore";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <ProtectedRoute>  <Dashboard />  </ProtectedRoute> } />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/chat/:chatId" element={<Chat />} /> 
        <Route path="/about" element={<LearnMore />} />
      </Routes>
    </Router>
  );
}

export default App;