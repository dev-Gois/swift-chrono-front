import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster as ToasterProvider } from '@/components/ui/toaster';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import { QueryProvider } from './providers/QueryProvider';
import { useInitAuth } from './hooks/useInitAuth';

function App() {
  useInitAuth()

  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <ToasterProvider />
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;