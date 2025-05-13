import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Player from './Player';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { auth, logout } = useAuth();
  
  if (!auth.isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <Sidebar onLogout={logout} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>
        
        {/* Player */}
        <Player />
        
        {/* Mobile navigation */}
        <div className="md:hidden">
          <MobileNav onLogout={logout} />
        </div>
      </div>
    </div>
  );
};

export default Layout;