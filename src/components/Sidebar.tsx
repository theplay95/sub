import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Disc, Mic2, Search, ListMusic, Clock,
  Heart, LogOut, Music 
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-gray-800 border-r border-gray-700">
      <div className="px-6 py-6 flex items-center">
        <Music className="h-8 w-8 text-indigo-500" />
        <span className="ml-2 text-xl font-bold">Subsonic</span>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavItem to="/" icon={<Home size={20} />} label="Início" />
        <NavItem to="/albums" icon={<Disc size={20} />} label="Álbuns" />
        <NavItem to="/artists" icon={<Mic2 size={20} />} label="Artistas" />
        <NavItem to="/search" icon={<Search size={20} />} label="Buscar" />
        <NavItem to="/playlists" icon={<ListMusic size={20} />} label="Playlists" />
        
        <div className="pt-4 mt-4 border-t border-gray-700">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sua Biblioteca
          </h3>
        </div>
        
        <NavItem to="/recent" icon={<Clock size={20} />} label="Tocados Recentemente" />
        <NavItem to="/favorites" icon={<Heart size={20} />} label="Favoritos" />
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white hover:bg-gray-700 w-full"
        >
          <LogOut size={20} className="mr-3" />
          Sair
        </button>
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
        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;