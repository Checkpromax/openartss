import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  plan: 'free' | 'starter' | 'pro';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).slice(2),
      email,
      name: email.split('@')[0],
      isAdmin: email.includes('admin'),
      plan: 'free',
    };
    setUser(mockUser);
    setIsLoading(false);
    return true;
  }, []);

  const signup = useCallback(async (email: string, _password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).slice(2),
      email,
      name,
      isAdmin: false,
      plan: 'free',
    };
    setUser(mockUser);
    setIsLoading(false);
    return true;
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const mockUser: User = {
      id: 'usr_google_' + Math.random().toString(36).slice(2),
      email: 'user@gmail.com',
      name: 'Google User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      isAdmin: false,
      plan: 'free',
    };
    setUser(mockUser);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
