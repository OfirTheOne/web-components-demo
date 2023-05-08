import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { Album } from '../../model';
import './spotify-album.scss';

export interface SpotifyAlbumProps extends Album {
  onClick: () => void
}

export const SpotifyAlbum: FC<SpotifyAlbumProps> = ({ image, title, artist, onClick }) => (
  <div className="spotify-album-container" onClick={onClick }>
    <img src={image} alt={title} className="spotify-album-image" />
    <h3 className="spotify-album-title">{title}</h3>
    <p className="spotify-album-artist">{artist}</p>
  </div>
);


