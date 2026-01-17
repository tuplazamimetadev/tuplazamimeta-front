import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DownloadsPage from './pages/DownloadsPage';
import GuidePage from './pages/GuidePage';
import TarifasPage from './pages/TarifasPage';
import PlanesPage from './pages/PlanesPage';
import TestsPage from './pages/TestPage';
import NewsPage from './pages/NewsPage'; 
import PracticalCasesPage from './pages/PracticalCasesPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tarifas" element={<TarifasPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/guia" element={<GuidePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/suscripcion" element={<PlanesPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/descargas" element={<DownloadsPage />} />
        <Route path="/noticias" element={<NewsPage />} /> {}
        <Route path="/supuestos" element={<PracticalCasesPage />} />
      </Routes>
    </Router>
  );
}

export default App;