import React from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '../types';
import subsonicApi from '../api/subsonicApi';
import { User } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  // Not all artists might have cover art
  const hasCoverArt = artist.coverArt !== undefined;
  const coverArtUrl = hasCoverArt ? subsonicApi.getCoverArtUrl(artist.coverArt!) : undefined;
  
  return (
    <Link 
      to={`/artist/${artist.id}`}
      className="group flex flex-col items-center p-4 rounded-md bg-gray-800 transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="aspect-square w-28 h-28 rounded-full overflow-hidden bg-gray-700 mb-3 flex items-center justify-center">
        {hasCoverArt ? (
          <img
            src={coverArtUrl}
            alt={artist.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <User size={40} className="text-gray-500" />
        )}
      </div>
      <h3 className="font-medium text-white text-center truncate w-full" title={artist.name}>
        {artist.name}
      </h3>
      <p className="text-xs text-gray-400">
        {artist.albumCount} {artist.albumCount === 1 ? 'album' : 'albums'}
      </p>
    </Link>
  );
};

export default ArtistCard;