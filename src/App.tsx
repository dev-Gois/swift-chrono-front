import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/Login';
import { DashboardLayout } from './components/Layout/dashboard-layout';
import { useInitAuth } from './hooks/useInitAuth';
import { AppProvider } from './providers/AppProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Admin/Dashboard';
import { Athletes } from './pages/Admin/Athletes';
import { Courses } from './pages/Admin/Courses';
import { Categories } from './pages/Admin/Categories';
import { Settings } from './pages/Admin/Settings';
import { Ranking } from './pages/Admin/Ranking';

function App() {
  useInitAuth()

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="athletes" element={<Athletes />} />
            <Route path="courses" element={<Courses />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ranking" element={<Ranking />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;