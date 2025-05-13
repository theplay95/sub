import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { PlayerState, Song } from '../types';
import subsonicApi from '../api/subsonicApi';

// Initial state for the player
const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 0.8,
  repeat: 'off',
  shuffle: false,
  elapsed: 0,
};

// Action types
type PlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_CURRENT_SONG'; payload: Song }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_QUEUE'; payload: Song[] }
  | { type: 'ADD_TO_QUEUE'; payload: Song }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_REPEAT'; payload: 'off' | 'all' | 'one' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_ELAPSED'; payload: number };

// Reducer function to handle state updates
function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_CURRENT_SONG':
      return { ...state, currentSong: action.payload, elapsed: 0 };
    case 'SET_CURRENT_INDEX':
      return { 
        ...state, 
        currentIndex: action.payload,
        currentSong: state.queue[action.payload] || null,
        elapsed: 0 
      };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'REMOVE_FROM_QUEUE':
      return {
        ...state,
        queue: state.queue.filter((_, index) => index !== action.payload),
      };
    case 'CLEAR_QUEUE':
      return { ...state, queue: [], currentIndex: -1, currentSong: null };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_REPEAT':
      return { ...state, repeat: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'SET_ELAPSED':
      return { ...state, elapsed: action.payload };
    default:
      return state;
  }
}

// Create context for the player
interface PlayerContextType {
  state: PlayerState;
  playSong: (song: Song) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setRepeat: (mode: 'off' | 'all' | 'one') => void;
  toggleShuffle: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  seekTo: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Provider component
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element when component mounts
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
    
    // Clean up when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle changes to currentSong
  useEffect(() => {
    if (state.currentSong && audioRef.current) {
      // Get stream URL for the song
      const streamUrl = subsonicApi.getStreamUrl(state.currentSong.id);
      
      // Set new source
      audioRef.current.src = streamUrl;
      
      // Load and play if isPlaying is true
      audioRef.current.load();
      if (state.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          dispatch({ type: 'PAUSE' });
        });
      }
    }
  }, [state.currentSong]);
  
  // Handle changes to isPlaying
  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          dispatch({ type: 'PAUSE' });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying]);
  
  // Handle changes to volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);
  
  // Setup event listeners for the audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Update elapsed time
    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_ELAPSED', payload: audio.currentTime });
    };
    
    // Handle end of song
    const handleEnded = () => {
      // Handle based on repeat settings
      if (state.repeat === 'one') {
        // Repeat current song
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        // Go to next song
        next();
      }
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    // Remove event listeners on cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.repeat, state.currentIndex, state.queue]);
  
  // Function to play a single song
  const playSong = (song: Song) => {
    // Add song to queue if it's not already there
    if (!state.queue.some(queueSong => queueSong.id === song.id)) {
      dispatch({ type: 'SET_QUEUE', payload: [song] });
      dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 });
    } else {
      // Find song in queue
      const songIndex = state.queue.findIndex(queueSong => queueSong.id === song.id);
      if (songIndex !== -1) {
        dispatch({ type: 'SET_CURRENT_INDEX', payload: songIndex });
      }
    }
    
    dispatch({ type: 'PLAY' });
  };
  
  // Function to play a queue of songs
  const playQueue = (songs: Song[], startIndex: number = 0) => {
    dispatch({ type: 'SET_QUEUE', payload: songs });
    dispatch({ type: 'SET_CURRENT_INDEX', payload: startIndex });
    dispatch({ type: 'PLAY' });
  };
  
  // Function to toggle play/pause
  const togglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };
  
  // Function to go to next song
  const next = () => {
    if (state.queue.length === 0) return;
    
    let nextIndex;
    
    if (state.shuffle) {
      // Get random index (excluding current song)
      const availableIndices = Array.from(
        { length: state.queue.length },
        (_, i) => i
      ).filter(i => i !== state.currentIndex);
      
      if (availableIndices.length === 0) return;
      
      const randomIdx = Math.floor(Math.random() * availableIndices.length);
      nextIndex = availableIndices[randomIdx];
    } else {
      // Normal sequential playback
      nextIndex = state.currentIndex + 1;
      
      // Handle repeat all
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
        } else {
          // End of queue, stop playback
          dispatch({ type: 'PAUSE' });
          return;
        }
      }
    }
    
    dispatch({ type: 'SET_CURRENT_INDEX', payload: nextIndex });
    dispatch({ type: 'PLAY' });
  };
  
  // Function to go to previous song
  const previous = () => {
    if (state.queue.length === 0) return;
    
    // If more than 3 seconds have elapsed, restart the current song
    if (state.elapsed > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    let prevIndex = state.currentIndex - 1;
    
    // Handle beginning of queue
    if (prevIndex < 0) {
      if (state.repeat === 'all') {
        prevIndex = state.queue.length - 1;
      } else {
        // Beginning of queue, stop if not repeating
        prevIndex = 0;
      }
    }
    
    dispatch({ type: 'SET_CURRENT_INDEX', payload: prevIndex });
    dispatch({ type: 'PLAY' });
  };
  
  // Function to set volume
  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: Math.max(0, Math.min(1, volume)) });
  };
  
  // Function to set repeat mode
  const setRepeat = (mode: 'off' | 'all' | 'one') => {
    dispatch({ type: 'SET_REPEAT', payload: mode });
  };
  
  // Function to toggle shuffle
  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };
  
  // Function to add a song to the queue
  const addToQueue = (song: Song) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: song });
  };
  
  // Function to remove a song from the queue
  const removeFromQueue = (index: number) => {
    // If removing current song, play next song
    if (index === state.currentIndex) {
      next();
    } else if (index < state.currentIndex) {
      // If removing a song before current, adjust current index
      dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex - 1 });
    }
    
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: index });
  };
  
  // Function to clear the queue
  const clearQueue = () => {
    dispatch({ type: 'CLEAR_QUEUE' });
    dispatch({ type: 'PAUSE' });
  };
  
  // Function to seek to a specific time
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_ELAPSED', payload: time });
    }
  };
  
  return (
    <PlayerContext.Provider
      value={{
        state,
        playSong,
        playQueue,
        togglePlay,
        next,
        previous,
        setVolume,
        setRepeat,
        toggleShuffle,
        addToQueue,
        removeFromQueue,
        clearQueue,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// Hook to use the player context
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};