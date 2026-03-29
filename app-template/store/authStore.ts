/**
 * Auth Store — Zustand-based authentication state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appConfig } from '../config/tenant';

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  phone?: string;
}

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
}

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Setters
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
      }),
      
      setTokens: (token, refreshToken) => set({ 
        token, 
        refreshToken: refreshToken || get().refreshToken,
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${appConfig.api.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Login fehlgeschlagen');
          }
          
          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login fehlgeschlagen',
          });
          return false;
        }
      },
      
      // Logout
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      // Refresh Token
      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;
        
        try {
          const response = await fetch(`${appConfig.api.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (!response.ok) {
            get().logout();
            return false;
          }
          
          const data = await response.json();
          
          set({
            token: data.token,
            refreshToken: data.refreshToken || refreshToken,
          });
          
          return true;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
export const useAuthToken = () => useAuthStore((state) => state.token);

export default useAuthStore;
