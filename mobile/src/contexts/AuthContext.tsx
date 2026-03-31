import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { type User, type AuthResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@sf_token');
        const storedUserRaw = await AsyncStorage.getItem('@sf_user');

        if (storedToken && storedUserRaw) {
          const storedUser = JSON.parse(storedUserRaw);
          setUser(storedUser);

          // Refresh user data from server in background
          try {
            const response = await api.get<User>('/users/me');
            setUser(response.data);
            await AsyncStorage.setItem('@sf_user', JSON.stringify(response.data));
          } catch (error) {
            console.error('Failed to refresh user profile:', error);
            // If it's a 401 Unauthorized, we should probably log them out
            // but we'll let the user decide manually for now
          }
        }
      } catch (error) {
        console.error('Failed to load session from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    
    // Save to storage
    await AsyncStorage.setItem('@sf_token', response.data.accessToken);
    await AsyncStorage.setItem('@sf_user', JSON.stringify(response.data.user));
    
    setUser(response.data.user);
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    
    // Save to storage
    await AsyncStorage.setItem('@sf_token', response.data.accessToken);
    await AsyncStorage.setItem('@sf_user', JSON.stringify(response.data.user));
    
    setUser(response.data.user);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@sf_token');
    await AsyncStorage.removeItem('@sf_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await api.get<User>('/users/me');
    setUser(response.data);
    await AsyncStorage.setItem('@sf_user', JSON.stringify(response.data));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
