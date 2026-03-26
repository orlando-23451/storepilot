import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import api, { normalizeApiError } from './api';
import LayoutComponent from './components/LayoutComponent';
import LoadingComponent from './components/LoadingComponent';
import NotificationComponent from './components/NotificationComponent';
import DashboardPage from './pages/DashboardPage';
import HelpPage from './pages/HelpPage';
import InventoryPage from './pages/InventoryPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PricingPage from './pages/PricingPage';
import ProductsPage from './pages/ProductsPage';
import PurchasesPage from './pages/PurchasesPage';
import ReportsPage from './pages/ReportsPage';
import SalesPage from './pages/SalesPage';
import UsersPage from './pages/UsersPage';
import routeNames from './routeNames';
import { clearSession, getStoredToken, getStoredUser, saveSession } from './utils/session';

const ProtectedPage = ({
  user,
  loading,
  allowedRoles,
  notification,
  onDismissNotification,
  onLogout,
  children,
}) => {
  if (loading) {
    return <LoadingComponent text="Preparando tu sesión..." />;
  }

  if (!user) {
    return <Navigate to={routeNames.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role_code)) {
    return <Navigate to={routeNames.dashboard} replace />;
  }

  return (
    <LayoutComponent user={user} onLogout={onLogout}>
      <NotificationComponent notification={notification} onDismiss={onDismissNotification} />
      {children}
    </LayoutComponent>
  );
};

const App = () => {
  const [user, setUser] = useState(getStoredUser());
  const [bootLoading, setBootLoading] = useState(Boolean(getStoredToken()));
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const hydrateSession = async () => {
      const token = getStoredToken();
      if (!token) {
        setBootLoading(false);
        return;
      }

      try {
        const response = await api.auth.me();
        setUser(response.data);
        saveSession({ token, user: response.data });
      } catch (error) {
        clearSession();
        setUser(null);
        const normalizedError = normalizeApiError(error);
        setNotification({
          type: 'warning',
          title: 'Tu sesión expiró',
          message: normalizedError.message,
        });
      } finally {
        setBootLoading(false);
      }
    };

    hydrateSession();
  }, []);

  const appNotification = useMemo(() => notification, [notification]);

  const handleSessionStart = (sessionUser) => {
    setUser(sessionUser);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setNotification({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Tu sesión se cerró correctamente.',
    });
  };

  return (
    <Routes>
      <Route path={routeNames.landing} element={<LandingPage />} />
      <Route
        path={routeNames.login}
        element={
          user ? (
            <Navigate to={routeNames.dashboard} replace />
          ) : (
            <LoginPage onSessionStart={handleSessionStart} onNotify={setNotification} />
          )
        }
      />
      <Route path={routeNames.app} element={<Navigate to={routeNames.dashboard} replace />} />
      <Route
        path={routeNames.dashboard}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <DashboardPage user={user} onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.products}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <ProductsPage user={user} onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.purchases}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            allowedRoles={['admin']}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <PurchasesPage onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.inventory}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            allowedRoles={['admin']}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <InventoryPage onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.sales}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <SalesPage onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.pricing}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            allowedRoles={['admin']}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <PricingPage onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.reports}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            allowedRoles={['admin']}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <ReportsPage onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.users}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            allowedRoles={['admin']}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <UsersPage onNotify={setNotification} />
          </ProtectedPage>
        }
      />
      <Route
        path={routeNames.help}
        element={
          <ProtectedPage
            user={user}
            loading={bootLoading}
            notification={appNotification}
            onDismissNotification={() => setNotification(null)}
            onLogout={handleLogout}
          >
            <HelpPage />
          </ProtectedPage>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
