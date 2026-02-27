import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        // Not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      setUser(data.user);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao realizar login';
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      throw error;
    }
  };

  const register = async (credentials: any) => {
    try {
      const { data } = await api.post('/auth/register', credentials);
      setUser(data.user);
      toast.success('Cadastro realizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao realizar cadastro';
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logout realizado.');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
