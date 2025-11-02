import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Experiences from './pages/Experiences';
import Career from './pages/Career';
import ContentViewer from './pages/ContentViewer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-gradient">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/career" element={<Career />} />
            <Route path="/content/:type/:filename" element={<ContentViewer />} />
            <Route path="/content/:type/:category/:filename" element={<ContentViewer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
