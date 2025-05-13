import React, { useState, useEffect } from 'react';
import subsonicApi from '../api/subsonicApi';
import AlbumCard from '../components/AlbumCard';
import { Album } from '../types';

const HomePage: React.FC = () => {
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
  const [randomAlbums, setRandomAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent albums
        const recentResponse = await subsonicApi.getAlbumList('newest', 12);
        setRecentAlbums(recentResponse.albumList?.album || []);
        
        // Fetch random albums
        const randomResponse = await subsonicApi.getAlbumList('random', 12);
        setRandomAlbums(randomResponse.albumList?.album || []);
        
        setError(null);
      } catch (err) {
        setError('Failed to load music library. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading your music...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="bg-red-900/40 border border-red-500 text-red-200 px-6 py-4 rounded max-w-lg">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      
      {/* Recent albums */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recently Added</h2>
          <a href="/albums" className="text-sm text-indigo-400 hover:text-indigo-300">
            View all
          </a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
      
      {/* Random albums */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Discover</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {randomAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;