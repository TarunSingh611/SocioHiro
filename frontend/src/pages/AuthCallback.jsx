import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useUserStore from '../store/userStore';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleInstagramCallback, syncAuthState } = useUserStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const dataParam = searchParams.get('data');
        if (dataParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(dataParam));
            console.log('Instagram callback data:', userData);
            
            await handleInstagramCallback(userData);
            // Sync the auth state to ensure consistency
            syncAuthState();
            // Add a small delay to ensure state is properly set
            setTimeout(() => {
              navigate('/dashboard');
            }, 100);
          } catch (error) {
            console.error('Instagram callback error:', error);
            setError(error.message || 'Instagram authentication failed');
          }
        } else {
          // Fallback for direct API status check if no data param
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/instagram/callback`, {
              credentials: 'include'
            });
            const responseData = await response.json();
            await handleInstagramCallback(responseData);
            // Sync the auth state to ensure consistency
            syncAuthState();
            // Add a small delay to ensure state is properly set
            setTimeout(() => {
              navigate('/dashboard');
            }, 100);
          } catch (apiError) {
            console.error('Instagram callback API error:', apiError);
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
  }, [searchParams, navigate, handleInstagramCallback, syncAuthState]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  return null;
};

export default AuthCallback; 