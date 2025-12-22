import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Mynotes from './pages/Mynotes';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/mynotes" element={<Mynotes />} />
            </Route>
          </Routes>
        </main>
        <footer className="py-4 text-center text-muted border-top border-secondary mt-auto">
          <Container>
            <p className="mb-0 small">© {new Date().getFullYear()} MovieWatch. All rights reserved.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
