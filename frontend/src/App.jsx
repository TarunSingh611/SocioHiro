import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useUserStore from './store/userStore';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import AddAutomation from './pages/AddAutomation';
import AddCampaign from './pages/AddCampaign';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Campaigns from './pages/Campaigns';
import InstagramAccounts from './pages/InstagramAccounts';
import Automation from './pages/Automation';
import Settings from './pages/Settings';
import AccountSettings from './pages/AccountSettings';
import Content from './pages/Content';
import './App.css';

function App() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Root route: redirect based on auth */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        {/* Auth callback route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Dashboard: protected */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
        {/* Login: redirect if already logged in */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/login" replace />} />
        {/* Products: protected */}
        <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" replace />} />
        {/* Add Product: protected */}
        <Route path="/products/new" element={isAuthenticated ? <AddProduct /> : <Navigate to="/login" replace />} />
        {/* Add Automation: protected */}
        <Route path="/automation/new" element={isAuthenticated ? <AddAutomation /> : <Navigate to="/login" replace />} />
        {/* Add Campaign: protected */}
        <Route path="/campaigns/new" element={isAuthenticated ? <AddCampaign /> : <Navigate to="/login" replace />} />
        {/* Orders: protected */}
        <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />} />
        {/* Analytics: protected */}
        <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" replace />} />
        {/* Campaigns: protected */}
        <Route path="/campaigns" element={isAuthenticated ? <Campaigns /> : <Navigate to="/login" replace />} />
        {/* Instagram Accounts: protected */}
        <Route path="/instagram-accounts" element={isAuthenticated ? <InstagramAccounts /> : <Navigate to="/login" replace />} />
        {/* Automation: protected */}
        <Route path="/automation" element={isAuthenticated ? <Automation /> : <Navigate to="/login" replace />} />
        {/* Settings: protected */}
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
        {/* Account Settings: protected */}
        <Route path="/account-settings" element={isAuthenticated ? <AccountSettings /> : <Navigate to="/login" replace />} />
        {/* Content: protected */}
        <Route path="/content" element={isAuthenticated ? <Content /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
