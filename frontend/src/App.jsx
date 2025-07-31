import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useUserStore from './store/userStore';
import { useDebug } from './utils/debug';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AddAutomation from './pages/AddAutomation';
import AddCampaign from './pages/AddCampaign';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';

import Automation from './pages/Automation';
import AccountSettings from './pages/AccountSettings';
import Content from './pages/Content';
import './App.css';

function App() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);
  const checkAuthStatus = useUserStore((state) => state.checkAuthStatus);
  const syncAuthState = useUserStore((state) => state.syncAuthState);
  const debug = useDebug('App');

  useEffect(() => {
    debug.logMount({ isAuthenticated, isLoading });
    
    // First sync the auth state from localStorage
    syncAuthState();
    
    // Then check authentication status on app startup
    checkAuthStatus().then((isAuth) => {
      console.log('Initial auth check result:', isAuth);
    });

    return () => {
      debug.logUnmount();
    };
  }, [checkAuthStatus, syncAuthState]);

  useEffect(() => {
    debug.logStateChange(null, { isAuthenticated, isLoading });
    console.log('Auth state changed:', { isAuthenticated, isLoading });
    
    // Debug: Check localStorage token
    const token = localStorage.getItem('token');
    console.log('localStorage token exists:', !!token);
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Root route: redirect based on auth */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        {/* Auth callback route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Login: redirect if already logged in */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />

        {/* Protected routes with Layout */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/automation/new" element={
          isAuthenticated ? (
            <Layout>
              <AddAutomation />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/campaigns/new" element={
          isAuthenticated ? (
            <Layout>
              <AddCampaign />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/analytics" element={
          isAuthenticated ? (
            <Layout>
              <Analytics />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/campaigns" element={
          isAuthenticated ? (
            <Layout>
              <Campaigns />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />

        <Route path="/automation" element={
          isAuthenticated ? (
            <Layout>
              <Automation />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/account-settings" element={
          isAuthenticated ? (
            <Layout>
              <AccountSettings />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/content" element={
          isAuthenticated ? (
            <Layout>
              <Content />
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
