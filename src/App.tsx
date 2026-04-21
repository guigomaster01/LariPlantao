import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Donation } from './pages/Donation';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/donation" element={<Donation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
