import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FarmerFormPage from './pages/FarmerFormPage';
import ScoreResultPage from './pages/ScoreResultPage';
import BankDashboardPage from './pages/BankDashboardPage';
import AIChatBot from './components/AIChatBot';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Navbar />
      <Box sx={{ minHeight: '100vh', pt: 8, pb: 4, px: { xs: 2, md: 4 } }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<FarmerFormPage />} />
          <Route path="/score/:farmerId" element={<ScoreResultPage />} />
          <Route path="/dashboard" element={<BankDashboardPage />} />
        </Routes>
      </Box>
      <AIChatBot />
    </Router>
  );
}

export default App;
