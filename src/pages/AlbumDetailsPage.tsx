import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import subsonicApi from '../api/subsonicApi';
import { Album, Song } from '../types';
import SongRow from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, Clock, Music } from 'lucide-react';

const AlbumDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album & { songs: Song[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { playQueue, state, togglePlay } = usePlayer();
  
  const isCurrentAlbum = album?.songs.some(song => song.id === state.currentSong?.id);
  const isPlaying = isCurrentAlbum && state.isPlaying;
  
  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await subsonicApi.getAlbum(id);
        
        if (response.album) {
          setAlbum({
            ...response.album,
            songs: response.album.song || []
          });
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load album details. Please try again later.');
        console.error('Error fetching album:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlbum();
  }, [id]);
  
  const handlePlayAlbum = () => {
    if (!album) return;
    
    if (isCurrentAlbum) {
      togglePlay();
    } else {
      playQueue(album.songs, 0);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !album) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="bg-red-900/40 border border-red-500 text-red-200 px-6 py-4 rounded max-w-lg">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error || 'Album not found'}</p>
        </div>
      </div>
    );
  }
  
  const coverArtUrl = subsonicApi.getCoverArtUrl(album.coverArt, 500);
  const totalDuration = album.songs.reduce((sum, song) => sum + song.duration, 0);
  const formattedTotalDuration = Math.floor(totalDuration / 60);
  
  return (
    <div className="pb-20">
      {/* Album header */}
      <div 
        className="relative mb-6 bg-gradient-to-b from-indigo-900/70 to-gray-900 pt-12 pb-6 px-4 md:px-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-end">
          <div className="w-48 h-48 flex-shrink-0 rounded-md overflow-hidden shadow-lg mb-4 md:mb-0 md:mr-6">
            <img
              src={coverArtUrl}
              alt={album.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="uppercase text-xs font-semibold tracking-wider text-gray-400 mb-1">
              Album
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{album.name}</h1>
            <div className="flex items-center space-x-1 text-gray-300 mb-4">
              <span className="font-medium">{album.artist}</span>
              {album.year && (
                <>
                  <span>•</span>
                  <span>{album.year}</span>
                </>
              )}
              <span>•</span>
              <span>{album.songs.length} songs</span>
              <span>•</span>
              <span>About {formattedTotalDuration} min</span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handlePlayAlbum}
                className="flex items-center px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Songs list */}
      <div className="px-4 md:px-8">
        <div className="flex items-center text-gray-400 px-4 py-2 border-b border-gray-700 text-sm">
          <div className="mr-4 w-8 text-center flex-shrink-0">
            <span>#</span>
          </div>
          <div className="flex-grow min-w-0 mr-4">
            <span>Title</span>
          </div>
          <div className="flex-shrink-0 mr-4">
            <Clock size={16} />
          </div>
          <div className="w-8 flex-shrink-0">
            {/* Empty space for the menu button */}
          </div>
        </div>
        
        <div className="mt-2">
          {album.songs.length > 0 ? (
            album.songs.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} songs={album.songs} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Music size={48} className="mb-4 text-gray-600" />
              <p className="text-center">No songs found in this album</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailsPage;