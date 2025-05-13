import React, { useState } from 'react';
import subsonicApi from '../api/subsonicApi';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import SongRow from '../components/SongRow';
import { Album, Artist, Song } from '../types';
import { Search, Music, Mic2, Disc } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setHasSearched(true);
      
      const response = await subsonicApi.search(query);
      
      setArtists(response.searchResult3?.artist || []);
      setAlbums(response.searchResult3?.album || []);
      setSongs(response.searchResult3?.song || []);
      
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const hasResults = artists.length > 0 || albums.length > 0 || songs.length > 0;
  
  return (
    <div className="px-4 py-6 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for artists, albums, or songs..."
            className="block w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-md"
          >
            Search
          </button>
        </div>
      </form>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/40 border border-red-500 text-red-200 px-6 py-4 rounded">
          <p>{error}</p>
        </div>
      ) : hasSearched && !hasResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Search size={48} className="mb-4 text-gray-600" />
          <p className="text-center text-lg mb-2">No results found</p>
          <p className="text-center text-gray-500">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <>
          {/* Artists */}
          {artists.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center mb-4">
                <Mic2 size={20} className="mr-2 text-indigo-500" />
                <h2 className="text-xl font-semibold">Artists</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}
          
          {/* Albums */}
          {albums.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center mb-4">
                <Disc size={20} className="mr-2 text-indigo-500" />
                <h2 className="text-xl font-semibold">Albums</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
          
          {/* Songs */}
          {songs.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <Music size={20} className="mr-2 text-indigo-500" />
                <h2 className="text-xl font-semibold">Songs</h2>
              </div>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex items-center text-gray-400 px-4 py-2 border-b border-gray-700 text-sm">
                  <div className="mr-4 w-8 text-center flex-shrink-0">
                    <span>#</span>
                  </div>
                  <div className="flex-grow min-w-0 mr-4">
                    <span>Title</span>
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    <span>Duration</span>
                  </div>
                  <div className="w-8 flex-shrink-0">
                    {/* Empty space for the menu button */}
                  </div>
                </div>
                
                {songs.map((song, index) => (
                  <SongRow key={song.id} song={song} index={index} songs={songs} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
      
      {!hasSearched && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Search size={64} className="mb-6 text-gray-600" />
          <p className="text-center text-lg mb-2">Search for your favorite music</p>
          <p className="text-center text-gray-500">Find artists, albums, and songs in your library</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;