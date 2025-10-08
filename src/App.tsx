import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Create from './pages/Create';
import Activity from './pages/Activity';
import Reels from './pages/Reels';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes - No login required */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" replace /> : <Register />} 
        />
        
        {/* Public browsing routes */}
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/search" 
          element={<Search />} 
        />
        <Route 
          path="/explore" 
          element={<Explore />} 
        />
        <Route 
          path="/reels" 
          element={<Reels />} 
        />
        <Route 
          path="/profile/:username" 
          element={<Profile />} 
        />
        
        {/* Protected Routes - Login required */}
        <Route 
          path="/messages" 
          element={user ? <Messages /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity" 
          element={user ? <Notifications /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/create" 
          element={user ? <Create /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" replace />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
