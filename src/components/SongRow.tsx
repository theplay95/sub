import React from 'react';
import { Song } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { formatDuration } from '../utils/formatters';
import { Play, Pause, MoreHorizontal } from 'lucide-react';

interface SongRowProps {
  song: Song;
  index: number;
  songs: Song[];
}

const SongRow: React.FC<SongRowProps> = ({ song, index, songs }) => {
  const { playSong, playQueue, state, togglePlay } = usePlayer();
  
  const isCurrentSong = state.currentSong?.id === song.id;
  const isPlaying = isCurrentSong && state.isPlaying;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isCurrentSong) {
      togglePlay();
    } else {
      playQueue(songs, index);
    }
  };
  
  return (
    <div 
      className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ${
        isCurrentSong ? 'bg-gray-700/50' : ''
      }`}
    >
      <div className="mr-4 w-8 text-center flex-shrink-0">
        {isCurrentSong ? (
          <button
            onClick={handlePlay}
            className="focus:outline-none text-indigo-500 hover:text-indigo-400"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
        ) : (
          <span className="text-gray-400">{index + 1}</span>
        )}
      </div>
      
      <div className="flex-grow min-w-0 mr-4">
        <div className={`truncate font-medium ${isCurrentSong ? 'text-indigo-500' : 'text-white'}`}>
          {song.title}
        </div>
        <div className="text-gray-400 text-sm truncate">
          {song.artist}
        </div>
      </div>
      
      <div className="text-gray-400 text-sm flex-shrink-0 mr-4">
        {formatDuration(song.duration)}
      </div>
      
      <div className="flex-shrink-0">
        <button className="text-gray-500 hover:text-white focus:outline-none p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default SongRow;