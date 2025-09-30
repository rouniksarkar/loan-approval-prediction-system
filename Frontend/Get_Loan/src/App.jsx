import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/Navbar';
import ProtectedRoute from './component/common/ProtectedRoute';
import Homepage from './component/home/Homepage';
import Login from './component/auth/Login';
import Signup from './component/auth/Signup';
import PredictForm from './component/prediction/PredictForm';
import { authService } from './services/auth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Only show Navbar on non-homepage routes */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<WithNavbar />} />
        </Routes>
      </div>
    </Router>
  );
}

// Component that includes navbar for all routes except homepage
function WithNavbar() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={
          authService.isAuthenticated() ? <Navigate to="/predict" replace /> : <Login />
        } />
        <Route path="/signup" element={
          authService.isAuthenticated() ? <Navigate to="/predict" replace /> : <Signup />
        } />
        <Route path="/predict" element={
          <ProtectedRoute>
            <PredictForm />
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;