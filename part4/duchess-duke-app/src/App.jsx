import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Places from './pages/Places';
import SelectedPlace from './pages/SelectedPlace';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import AddPlace from './pages/AddPlace';

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/places" element={<Places />} />
        <Route path="/estate/:id" element={<SelectedPlace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-place" element={<AddPlace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;