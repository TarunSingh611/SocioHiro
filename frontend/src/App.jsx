import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useUserStore from './store/userStore';
import { useDebug } from './utils/debug';
import Layout from './components/Layout';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AddAutomation from './pages/AddAutomation';
import AddCampaign from './pages/AddCampaign';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import InstagramAccounts from './pages/InstagramAccounts';
import Automation from './pages/Automation';
import AccountSettings from './pages/AccountSettings';
import Content from './pages/Content';
import './App.css';

function App() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const debug = useDebug('App');

  useEffect(() => {
    debug.logMount({ isAuthenticated });

    return () => {
      debug.logUnmount();
    };
  }, []);

  useEffect(() => {
    debug.logStateChange(null, { isAuthenticated });
  }, [isAuthenticated]);

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
        <Route path="/instagram-accounts" element={
          isAuthenticated ? (
            <Layout>
              <InstagramAccounts />
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
