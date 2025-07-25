import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import useUserStore from '../store/userStore';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const dataParam = searchParams.get('data');
        if (dataParam) {
          const userData = JSON.parse(decodeURIComponent(dataParam));
          if (userData.success) {
            setUser(userData.user, userData.accessToken);
            localStorage.setItem('isAuthenticated', 'true'); // Optional: for legacy code
            navigate('/dashboard');
          } else {
            setError(userData.error || 'Authentication failed');
          }
        } else {
          // Fallback for direct API status check if no data param
          try {
            const response = await axios.get('/api/instagram-oauth/user');
            if (response.data) {
              setUser(response.data, response.data.accessToken);
              localStorage.setItem('isAuthenticated', 'true');
              navigate('/dashboard');
            } else {
              setError('Authentication failed - no user data received');
            }
          } catch (apiError) {
            setError('Authentication failed - unable to verify status');
          }
        }
      } catch (error) {
        setError('Authentication failed - error parsing response');
      } finally {
        setLoading(false);
      }
    };
    handleCallback();
  }, [searchParams, navigate, setUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  return null;
};

export default AuthCallback; 