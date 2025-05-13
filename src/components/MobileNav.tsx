import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Disc, Mic2, Search, User } from 'lucide-react';

interface MobileNavProps {
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onLogout }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 pb-safe z-10">
      <div className="grid grid-cols-5 h-16">
        <NavItem to="/" icon={<Home size={20} />} label="Home" />
        <NavItem to="/albums" icon={<Disc size={20} />} label="Albums" />
        <NavItem to="/artists" icon={<Mic2 size={20} />} label="Artists" />
        <NavItem to="/search" icon={<Search size={20} />} label="Search" />
        <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center transition-colors ${
          isActive ? 'text-indigo-500' : 'text-gray-400 hover:text-white'
        }`
      }
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};

export default MobileNav;