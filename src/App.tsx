import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/errors/ErrorBoundary';
import { initRevenueCat } from './lib/revenueCat';

// Lazy load pages for better code splitting
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Dashboard = lazy(() =>
  import('./components/dashboard/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const SubscriptionList = lazy(() =>
  import('./components/subscriptions/SubscriptionList').then((m) => ({
    default: m.SubscriptionList,
  }))
);
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.Register })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then((m) => ({ default: m.Terms })));

// Loading fallback component
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0, 212, 255, 0.2)',
        borderTopColor: '#00d4ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  </div>
);

// Conditional home route: Landing for guests, Dashboard for authenticated users
const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 212, 255, 0.2)',
            borderTopColor: '#00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (user) {
    return (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    );
  }

  return <Landing />;
};

function AppContent() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Home: landing for guests, dashboard for authenticated */}
        <Route path="/" element={<HomeRoute />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/subscriptions"
            element={
              <AppLayout>
                <SubscriptionList />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    initRevenueCat();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111111',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
