import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setUser: (user, accessToken) => set({ user, accessToken, isAuthenticated: !!user }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'sociohiro-user', // key in localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore; 