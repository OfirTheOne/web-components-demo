import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { setCurrentTrack } from '../../signals';
import { Album } from '../../model';
import './spotify-album.scss';

export type SpotifyAlbumProps = Album

export const SpotifyAlbum: FC<SpotifyAlbumProps> = ({ image, title, artist, songs }) => (
  <div className="spotify-album-container" onClick={ () => {
    setCurrentTrack({ name: songs[0].name, length: songs[0].length, albumName: title})
  }}>
    <img src={image} alt={title} className="spotify-album-image" />
    <h3 className="spotify-album-title">{title}</h3>
    <p className="spotify-album-artist">{artist}</p>
  </div>
);


