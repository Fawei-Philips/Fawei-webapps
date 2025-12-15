import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RabbitMQProvider } from './contexts/RabbitMQContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navigation from './components/common/Navigation';
import LoginPage from './pages/LoginPage';
import GalleryPage from './pages/GalleryPage';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RabbitMQProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="app-layout">
                      <Navigation />
                      <main className="app-main">
                        <Routes>
                          <Route path="/" element={<GalleryPage />} />
                          <Route path="/upload" element={<UploadPage />} />
                          <Route path="/history" element={<HistoryPage />} />
                          <Route path="/profile" element={<UserProfile />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </RabbitMQProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
