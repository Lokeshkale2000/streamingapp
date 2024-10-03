import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Videos from './components/Videos';
import VideoUpload from './components/VideoUpload';


const App = () => {
  return (
    <Router>
      <div >
        <Navbar  />
        <Routes>
          <Route path="/" element={<VideoUpload />} />
          <Route path="/videos" element={<Videos />} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
