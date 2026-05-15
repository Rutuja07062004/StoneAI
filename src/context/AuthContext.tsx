import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authStorage from '../services/authStorage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await authStorage.getUser();
      const token = await authStorage.getToken();

      if (storedUser && token) {
        // Optionally validate token with backend here
        setUser(storedUser);
      }
    } catch (e) {
      console.error('Failed to load storage data', e);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      await authStorage.saveToken(token);
      await authStorage.saveUser(userData);
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: userData } = response.data;

      await authStorage.saveToken(token);
      await authStorage.saveUser(userData);
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await authStorage.clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
