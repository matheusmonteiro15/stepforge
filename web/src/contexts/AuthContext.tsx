import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as api from '../services/api';

interface AuthContextType {
  user: api.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (storedUser && api.isAuthenticated()) {
      setUser(storedUser);
      // Refresh from server in background
      api.getProfile()
        .then(freshUser => setUser(freshUser))
        .catch(() => {
          // Token expired
          api.logout();
          setUser(null);
        });
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const res = await api.register(name, email, password);
    setUser(res.user);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const freshUser = await api.getProfile();
    setUser(freshUser);
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
      }}
    >
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
