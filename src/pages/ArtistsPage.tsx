import React, { useState, useEffect } from 'react';
import subsonicApi from '../api/subsonicApi';
import ArtistCard from '../components/ArtistCard';
import { Artist } from '../types';

const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await subsonicApi.getArtists();
        
        // Flatten all artists from all indices
        const allArtists = response.artists.index.flatMap(index => index.artist || []);
        
        setArtists(allArtists);
        setError(null);
      } catch (err) {
        setError('Failed to load artists. Please try again later.');
        console.error('Error fetching artists:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtists();
  }, []);
  
  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Artists</h1>
      
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
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
      
      {!loading && !error && artists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-center">No artists found</p>
        </div>
      )}
    </div>
  );
};

export default ArtistsPage;