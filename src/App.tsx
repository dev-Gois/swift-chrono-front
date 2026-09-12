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
import { PublicCategories } from './pages/Public/Categories';
import { PublicRanking } from './pages/Public/Ranking';
import { TrainingDisplay } from './pages/Public/TrainingDisplay';

function App() {
  useInitAuth()

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/categories" element={<PublicCategories />} />
          <Route path="/ranking/:categoryId" element={<PublicRanking />} />
          <Route path="/training-display" element={<TrainingDisplay />} />
          
          {/* Rotas de autenticação */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotas protegidas do dashboard */}
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
          
          {/* Rota padrão redireciona para categorias públicas */}
          <Route path="/" element={<Navigate to="/categories" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
