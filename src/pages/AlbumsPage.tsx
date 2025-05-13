import React, { useState, useEffect } from 'react';
import subsonicApi from '../api/subsonicApi';
import AlbumCard from '../components/AlbumCard';
import { Album } from '../types';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Recently Played', value: 'recent' },
  { label: 'Most Played', value: 'frequent' },
  { label: 'Random', value: 'random' },
  { label: 'Alphabetical', value: 'alphabeticalByName' },
];

const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState('newest');
  
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await subsonicApi.getAlbumList(sortType, 50);
        setAlbums(response.albumList?.album || []);
        setError(null);
      } catch (err) {
        setError('Failed to load albums. Please try again later.');
        console.error('Error fetching albums:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlbums();
  }, [sortType]);
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  };
  
  return (
    <div className="px-4 py-6 md:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Albums</h1>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-select" className="text-sm text-gray-400">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortType}
            onChange={handleSortChange}
            className="bg-gray-800 border border-gray-700 text-white rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/40 border border-red-500 text-red-200 px-6 py-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
      
      {!loading && !error && albums.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-center">No albums found</p>
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;