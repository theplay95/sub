import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import Layout from './components/Layout';

// Pages
import Login from './components/Login';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailsPage from './pages/AlbumDetailsPage';
import ArtistsPage from './pages/ArtistsPage';
import SearchPage from './pages/SearchPage';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { auth } = useAuth();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{element}</>;
};

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={<ProtectedRoute element={<HomePage />} />} 
              />
              <Route 
                path="/albums" 
                element={<ProtectedRoute element={<AlbumsPage />} />} 
              />
              <Route 
                path="/album/:id" 
                element={<ProtectedRoute element={<AlbumDetailsPage />} />} 
              />
              <Route 
                path="/artists" 
                element={<ProtectedRoute element={<ArtistsPage />} />} 
              />
              <Route 
                path="/search" 
                element={<ProtectedRoute element={<SearchPage />} />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;