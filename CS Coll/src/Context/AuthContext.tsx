import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing (in production, this would be replaced with Supabase auth)
const DEMO_USERS = [
  { id: '1', email: 'admin@attenance.com', password: 'admin123', name: 'John Admin', role: 'admin' as UserRole },
  { id: '2', email: 'staff@attenance.com', password: 'staff123', name: 'Jane Staff', role: 'staff' as UserRole },
  { id: '3', email: 'mike@attenance.com', password: 'mike123', name: 'Mike Johnson', role: 'staff' as UserRole },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('attenance_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('attenance_user');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      localStorage.setItem('attenance_user', JSON.stringify(userData));
      setAuthState({ user: userData, isAuthenticated: true, isLoading: false });
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    localStorage.removeItem('attenance_user');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
