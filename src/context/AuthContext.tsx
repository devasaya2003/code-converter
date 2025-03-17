
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (provider: 'email' | 'google' | 'github', credentials?: { email: string; password: string }) => Promise<void>;
  signup: (userData: { userName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // This would be replaced with actual Supabase session check
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (
    provider: 'email' | 'google' | 'github', 
    credentials?: { email: string; password: string }
  ) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual Supabase auth
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for demonstration
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        user_name: provider === 'email' ? credentials?.email?.split('@')[0] || 'user' : `${provider}_user`,
        email: credentials?.email || `${provider}_user@example.com`,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success(`Logged in successfully with ${provider}`);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`Failed to log in with ${provider}. Please try again.`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { userName: string; email: string; password: string }) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual Supabase auth
      // Simulate signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data for demonstration
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        user_name: userData.userName,
        email: userData.email,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual Supabase signOut
      localStorage.removeItem('user');
      setUser(null);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
