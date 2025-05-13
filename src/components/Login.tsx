import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Music } from 'lucide-react';

const Login: React.FC = () => {
  const { login, auth } = useAuth();
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login({ serverUrl, username, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Music size={48} className="text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Subsonic Player</h1>
          <p className="mt-2 text-gray-400">Sign in to your Subsonic server</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          {auth.error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {auth.error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="serverUrl" className="block text-sm font-medium text-gray-300 mb-1">
                Server URL
              </label>
              <input
                id="serverUrl"
                type="url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="https://your-server.com"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </form>
          
          <div className="mt-4 text-sm text-gray-400 text-center">
            <p>Need help? Check the <a href="http://www.subsonic.org/pages/api.jsp" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Subsonic API documentation</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;