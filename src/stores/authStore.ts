import { create } from 'zustand';
import { api } from '../services/api.js';

interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  clearError: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    const result = await api.login(email, password);
    
    if (result.error) {
      set({
        error: result.error,
        isLoading: false,
      });
      return false;
    }
    
    if (result.data) {
      api.setToken(result.data.token);
      set({
        user: result.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    
    set({ isLoading: false });
    return false;
  },
  
  logout: () => {
    api.setToken(null);
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
  
  recoverPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    const result = await api.forgotPassword(email);
    
    if (result.error) {
      set({
        error: result.error,
        isLoading: false,
      });
      return false;
    }
    
    set({ isLoading: false });
    return true;
  },
  
  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    
    const result = await api.resetPassword(token, password);
    
    if (result.error) {
      set({
        error: result.error,
        isLoading: false,
      });
      return false;
    }
    
    set({ isLoading: false });
    return true;
  },
  
  clearError: () => set({ error: null }),
  
  checkSession: async () => {
    const token = api.getToken();
    if (!token) return;
    
    const result = await api.getMe();
    
    if (result.data) {
      set({
        user: result.data.user,
        isAuthenticated: true,
      });
    } else {
      // Token invalid, clear it
      api.setToken(null);
    }
  },
}));

// Check session on app load
useAuthStore.getState().checkSession();
