import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';
import DetailRoomPage from './pages/DetailRoomPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import FormRoomPage from './pages/FormRoomPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/room/:id" element={<DetailRoomPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/history" element={<HistoryPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/rooms/new" element={<FormRoomPage />} />
        <Route path="/admin/rooms/edit/:id" element={<FormRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;