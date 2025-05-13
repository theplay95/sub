import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SubsonicCredentials, AuthState } from '../types';
import subsonicApi from '../api/subsonicApi';

interface AuthContextType {
  auth: AuthState;
  login: (credentials: SubsonicCredentials) => Promise<boolean>;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  credentials: null,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    // Try to load credentials from localStorage on init
    const savedCredentials = localStorage.getItem('subsonicCredentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials) as SubsonicCredentials;
      subsonicApi.setCredentials(credentials);
      return {
        isAuthenticated: true,
        credentials,
        error: null,
      };
    }
    return initialState;
  });

  // Verify credentials on mount
  useEffect(() => {
    if (auth.isAuthenticated) {
      subsonicApi.ping().catch(() => {
        // If ping fails, clear credentials
        logout();
      });
    }
  }, []);

  const login = async (credentials: SubsonicCredentials): Promise<boolean> => {
    try {
      // Set the credentials in the API
      subsonicApi.setCredentials(credentials);
      
      // Test the connection
      const success = await subsonicApi.ping();
      
      if (success) {
        // Save credentials to localStorage
        localStorage.setItem('subsonicCredentials', JSON.stringify(credentials));
        
        setAuth({
          isAuthenticated: true,
          credentials,
          error: null,
        });
        
        return true;
      } else {
        // Clear credentials if login failed
        subsonicApi.clearCredentials();
        
        setAuth({
          isAuthenticated: false,
          credentials: null,
          error: 'Failed to connect to server',
        });
        
        return false;
      }
    } catch (error) {
      subsonicApi.clearCredentials();
      
      setAuth({
        isAuthenticated: false,
        credentials: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return false;
    }
  };

  const logout = () => {
    // Clear API credentials
    subsonicApi.clearCredentials();
    
    // Remove from localStorage
    localStorage.removeItem('subsonicCredentials');
    
    // Update state
    setAuth(initialState);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};