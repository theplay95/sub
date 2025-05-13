import React, { useState, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { formatDuration } from '../utils/formatters';
import subsonicApi from '../api/subsonicApi';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Repeat, Repeat1, List, Shuffle 
} from 'lucide-react';

const Player: React.FC = () => {
  const { 
    state, togglePlay, previous, next, setVolume, 
    setRepeat, toggleShuffle, seekTo 
  } = usePlayer();
  
  const [expanded, setExpanded] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  
  // Update seek position when elapsed time changes
  useEffect(() => {
    if (!seeking && state.currentSong) {
      setSeekPosition(state.elapsed);
    }
  }, [state.elapsed, seeking, state.currentSong]);
  
  const handleSeekStart = () => {
    setSeeking(true);
  };
  
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekPosition(parseFloat(e.target.value));
  };
  
  const handleSeekEnd = () => {
    if (state.currentSong) {
      seekTo(seekPosition);
    }
    setSeeking(false);
  };
  
  // If no current song, don't render the player
  if (!state.currentSong) {
    return null;
  }
  
  const currentSong = state.currentSong;
  const coverArtUrl = subsonicApi.getCoverArtUrl(currentSong.coverArt);
  const songDuration = currentSong.duration;
  const formattedElapsed = formatDuration(state.elapsed);
  const formattedDuration = formatDuration(songDuration);
  
  // Get the appropriate volume icon based on current volume
  const VolumeIcon = state.volume === 0 ? VolumeX : state.volume < 0.5 ? Volume1 : Volume2;
  
  // Get the appropriate repeat icon based on repeat mode
  const RepeatIcon = state.repeat === 'one' ? Repeat1 : Repeat;
  
  // Mini player (collapsed view)
  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-2 px-4 z-10">
        <div className="flex items-center">
          <div 
            className="flex items-center flex-1 mr-2 cursor-pointer" 
            onClick={() => setExpanded(true)}
          >
            <img
              src={coverArtUrl}
              alt={currentSong.title}
              className="w-10 h-10 rounded shadow-sm mr-3"
            />
            <div className="truncate">
              <div className="text-white truncate font-medium">{currentSong.title}</div>
              <div className="text-gray-400 truncate text-sm">{currentSong.artist}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none"
            >
              {state.isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full mt-1 h-1 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500" 
            style={{ width: `${(state.elapsed / songDuration) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }
  
  // Full player (expanded view)
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        <button 
          onClick={() => setExpanded(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Album art */}
          <div className="w-64 h-64 md:w-80 md:h-80 mb-8 overflow-hidden rounded-lg shadow-lg">
            <img
              src={coverArtUrl}
              alt={currentSong.album}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Song info */}
          <div className="text-center mb-8 w-full">
            <h2 className="text-white text-2xl font-bold mb-1 truncate">{currentSong.title}</h2>
            <p className="text-gray-400 truncate">{currentSong.artist}</p>
            <p className="text-gray-500 text-sm truncate">{currentSong.album}</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full flex items-center space-x-2 mb-6">
            <span className="text-gray-400 text-sm w-12 text-right">{formattedElapsed}</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={0}
                max={songDuration}
                step={0.1}
                value={seekPosition}
                onChange={handleSeekChange}
                onMouseDown={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchStart={handleSeekStart}
                onTouchEnd={handleSeekEnd}
                className="w-full accent-indigo-500 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
              />
            </div>
            <span className="text-gray-400 text-sm w-12">{formattedDuration}</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between w-full max-w-xs mb-8">
            <button 
              onClick={toggleShuffle}
              className={`p-2 rounded-full focus:outline-none ${state.shuffle ? 'text-indigo-500' : 'text-gray-400 hover:text-white'}`}
            >
              <Shuffle size={20} />
            </button>
            
            <button 
              onClick={previous}
              className="p-2 text-gray-400 hover:text-white rounded-full focus:outline-none"
            >
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none"
            >
              {state.isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            
            <button 
              onClick={next}
              className="p-2 text-gray-400 hover:text-white rounded-full focus:outline-none"
            >
              <SkipForward size={24} />
            </button>
            
            <button 
              onClick={() => setRepeat(state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off')}
              className={`p-2 rounded-full focus:outline-none ${state.repeat !== 'off' ? 'text-indigo-500' : 'text-gray-400 hover:text-white'}`}
            >
              <RepeatIcon size={20} />
            </button>
          </div>
          
          {/* Volume slider */}
          <div className="flex items-center w-full max-w-xs mb-4">
            <button className="text-gray-400 mr-2">
              <VolumeIcon size={20} />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
            />
          </div>
          
          {/* Queue button */}
          <button className="flex items-center text-gray-400 hover:text-white">
            <List size={20} className="mr-2" />
            <span>Queue ({state.queue.length} songs)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;