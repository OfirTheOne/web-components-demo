import { FC } from 'sig';
import { IAlbum } from '../../../model';
import './album.scss';

export interface AlbumProps extends IAlbum {
  onClick: () => void
}

export const Album: FC<AlbumProps> = ({ image, title, artist, onClick }) => (
  <div className="album-container" onClick={onClick }>
    <img src={image} alt={title} className="album-image" />
    <h3 className="album-title">{title}</h3>
    <p className="album-artist">{artist}</p>
  </div>
);


