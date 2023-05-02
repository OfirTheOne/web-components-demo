import { WC } from '../../../lib/jsx';
import { FC } from '../../../lib/models/functional-component';
import './spotify-album.scss';

export interface SpotifyAlbumProps {
    image: string;
    title: string;
    artist: string;
}

export const SpotifyAlbum: FC<SpotifyAlbumProps> = ({ image, title, artist }) => (
  <div className="spotify-album-container">
    <img src={image} alt={title} classname="spotify-album-image" />
    <h3 className="spotify-album-title">{title}</h3>
    <p className="spotify-album-artist">{artist}</p>
  </div>
);


