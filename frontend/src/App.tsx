import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Landing Page is the default route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
