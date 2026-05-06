import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Donation } from './pages/Donation';
import { DailyDonationModal } from './components/DailyDonationModal';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donation" element={<Donation />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        <Header />
        <main className="max-w-4xl mx-auto px-4 pb-20 relative z-10">
          <AnimatedRoutes />
        </main>
        <DailyDonationModal />
      </div>
    </Router>
  );
}

export default App;
