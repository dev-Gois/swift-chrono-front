import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/Login';
import { DashboardLayout } from './components/Layout/dashboard-layout';
import { useInitAuth } from './hooks/useInitAuth';
import { AppProvider } from './providers/AppProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Admin/Dashboard';
import { Athletes } from './pages/Admin/Athletes';
import { Categories } from './pages/Admin/Categories';
import Settings from './pages/Admin/Settings';
import { AthleteLaps } from './pages/Admin/AthleteLaps';
import { Cronometer } from './pages/Admin/Cronometer';
import { Ranking } from './pages/Admin/Ranking';
import { CategoryRanking } from './pages/Admin/CategoryRanking';
import { Disqualifications } from './pages/Admin/Disqualifications';

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
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="athlete-laps" element={<AthleteLaps />} />
            <Route path="cronometer" element={<Cronometer />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="ranking/:categoryId" element={<CategoryRanking />} />
            <Route path="disqualifications" element={<Disqualifications />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;