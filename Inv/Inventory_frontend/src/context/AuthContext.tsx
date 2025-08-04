// src/context/AuthContext.tsx
import  { createContext, useContext, useState, ReactNode } from 'react';
import { loginAdmin, authSalesperson } from '../services/api';
import { useEffect } from 'react';
type User = {
  email: string;
  role: 'admin' | 'sales';
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string, role: 'admin' | 'sales', accessToken?: string) => Promise<void>;
  logout: () => void;
  showStartingPage: boolean;
  setShowStartingPage: (value: boolean) => void; 
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showStartingPage, setShowStartingPage] = useState(true);
  
  const login = async (email: string, password: string, role: 'admin' | 'sales', accessToken?: string) => {
  try {
    if (role === 'admin') {
      const res = await loginAdmin(email, password);
      setCurrentUser({ email, role: 'admin' });
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', 'admin'); // ✅ admin
    } else {
      const res = await authSalesperson(email, password, accessToken || '');
      setCurrentUser({ email, role: 'sales' });
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', 'sales'); // ✅ salesperson
    }

    setShowStartingPage(false);
    console.log('Login successful, role:', role); // ✅ optional debug
  } catch (error) {
    throw error;
  }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    if (token && role && email) {
      setCurrentUser({ email, role: role as 'admin' | 'sales' });
      setShowStartingPage(false);
    }
  }, []);
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    setShowStartingPage(true);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, showStartingPage, setShowStartingPage }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  
  return useContext(AuthContext)!;
};
