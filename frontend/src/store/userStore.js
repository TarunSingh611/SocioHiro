import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user, accessToken) => set({ user, accessToken, isAuthenticated: !!user }),
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken, sessionInfo } = response.data;
          
          // Set both localStorage and state
          localStorage.setItem('token', accessToken);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
          
          console.log('Login successful:', { user, isAuthenticated: true });
          
          // Return session info for potential limit notifications
          return { ...response.data, sessionInfo };
        } catch (error) {
          set({ isLoading: false });
          console.error('Login failed:', error);
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },
      register: async (userData) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/auth/register', userData);
          // After successful registration, login the user
          const loginResponse = await api.post('/auth/login', { 
            email: userData.email, 
            password: userData.password 
          });
          const { user, accessToken } = loginResponse.data;
          
          // Set both localStorage and state
          localStorage.setItem('token', accessToken);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
          
          console.log('Registration successful:', { user, isAuthenticated: true });
          return loginResponse.data;
        } catch (error) {
          set({ isLoading: false });
          console.error('Registration failed:', error);
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      },
      loginWithInstagram: async () => {
        try {
          // Redirect to backend Instagram OAuth endpoint
          window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/instagram/login`;
        } catch (error) {
          console.error('Instagram login failed:', error);
          throw new Error('Instagram login failed');
        }
      },
      handleInstagramCallback: async (userData) => {
        try {
          if (userData.success) {
            // The backend sends jwtToken for authentication and accessToken for Instagram API
            const jwtToken = userData.jwtToken;
            const instagramAccessToken = userData.accessToken;
            
            if (!jwtToken) {
              throw new Error('JWT token not received from server');
            }
            
            // Set the JWT token in localStorage for authentication
            localStorage.setItem('token', jwtToken);
            // Then set the user state with both tokens
            set({ 
              user: userData.user, 
              accessToken: jwtToken, // Use JWT for API authentication
              isAuthenticated: true 
            });
            console.log('Instagram login successful:', { 
              user: userData.user, 
              isAuthenticated: true,
              hasJWT: !!jwtToken,
              hasInstagramToken: !!instagramAccessToken
            });
            return userData;
          } else {
            throw new Error(userData.error || 'Instagram authentication failed');
          }
        } catch (error) {
          console.error('Instagram callback handling failed:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          // Call backend logout API to remove current session
          await api.post('/auth/logout');
          console.log('Backend logout successful - current session removed');
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with local logout even if API fails
        } finally {
          // Clear local state regardless of API success
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
          
          // Clear all localStorage items
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('sociohiro-user');
          
          // Clear any other auth-related items
          sessionStorage.clear();
          
          // Clear any cached data
          if (window.caches) {
            caches.keys().then(names => {
              names.forEach(name => {
                caches.delete(name);
              });
            });
          }
          
          // Clear any service worker registrations
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
              registrations.forEach(registration => {
                registration.unregister();
              });
            });
          }
          
          console.log('Frontend session data cleared completely');
        }
      },
      logoutAllDevices: async () => {
        try {
          // Call backend logout all devices API
          await api.post('/auth/logout-all');
          console.log('Backend logout all devices successful');
        } catch (error) {
          console.error('Logout all devices API call failed:', error);
          // Continue with local logout even if API fails
        } finally {
          // Clear local state regardless of API success
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
          
          // Clear all localStorage items
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('sociohiro-user');
          
          // Clear any other auth-related items
          sessionStorage.clear();
          
          // Clear any cached data
          if (window.caches) {
            caches.keys().then(names => {
              names.forEach(name => {
                caches.delete(name);
              });
            });
          }
          
          // Clear any service worker registrations
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
              registrations.forEach(registration => {
                registration.unregister();
              });
            });
          }
          
          console.log('Frontend session data cleared completely (all devices)');
        }
      },
      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });
          const token = localStorage.getItem('token');
          if (!token) {
            set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
            return false;
          }
          
          const response = await api.get('/auth/status');
          const { user } = response.data;
          set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
          console.log('Auth status check successful:', { user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Auth status check failed:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },
      syncAuthState: () => {
        const token = localStorage.getItem('token');
        const currentState = useUserStore.getState();
        
        if (token && !currentState.isAuthenticated) {
          // Token exists but state is not authenticated, sync it
          set({ accessToken: token, isAuthenticated: true });
          console.log('Synced auth state from localStorage');
        } else if (!token && currentState.isAuthenticated) {
          // No token but state is authenticated, clear it
          set({ user: null, accessToken: null, isAuthenticated: false });
          console.log('Cleared auth state - no token found');
        }
      },
      getSessionStatus: async () => {
        try {
          const response = await api.get('/auth/session-status');
          return response.data.session;
        } catch (error) {
          console.error('Failed to get session status:', error);
          return null;
        }
      },
      getActiveSessions: async () => {
        try {
          const response = await api.get('/auth/active-sessions');
          return response.data.sessions;
        } catch (error) {
          console.error('Failed to get active sessions:', error);
          return [];
        }
      },
      getRecentSessions: async () => {
        try {
          const response = await api.get('/auth/recent-sessions');
          return response.data.sessions;
        } catch (error) {
          console.error('Failed to get recent sessions:', error);
          return [];
        }
      },
      removeSession: async (sessionId) => {
        try {
          await api.delete(`/auth/sessions/${sessionId}`);
          console.log('Session removed successfully');
          return true;
        } catch (error) {
          console.error('Failed to remove session:', error);
          return false;
        }
      },
    }),
    {
      name: 'sociohiro-user', // key in localStorage
      getStorage: () => localStorage,
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useUserStore; 