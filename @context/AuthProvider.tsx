import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
