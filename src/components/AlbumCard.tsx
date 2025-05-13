import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '../types';
import subsonicApi from '../api/subsonicApi';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const coverArtUrl = subsonicApi.getCoverArtUrl(album.coverArt);
  
  return (
    <Link 
      to={`/album/${album.id}`}
      className="group flex flex-col overflow-hidden rounded-md bg-gray-800 transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={coverArtUrl}
          alt={album.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-white truncate" title={album.name}>
          {album.name}
        </h3>
        <p className="text-sm text-gray-400 truncate" title={album.artist}>
          {album.artist}
        </p>
        {album.year && (
          <p className="mt-1 text-xs text-gray-500">
            {album.year}
          </p>
        )}
      </div>
    </Link>
  );
};

export default AlbumCard;