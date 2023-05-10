import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { IAlbum } from '../../model';
import { setCurrentTrack } from '../../signals/action';
import { Album } from '../album/album';
import './album-list.scss';

export interface AlbumListProps {
    albums: IAlbum[];
    listTitle?: string;
}

export const AlbumList: FC<AlbumListProps> = ({ albums, listTitle = 'listTitle' }) => (
    <div className='album-list-container'> 
        <h2>{listTitle}</h2>
        <div className='album-list'>
            {albums.map((album) => (
                <Album
                    {...album}
                    onClick={() => {
                        setCurrentTrack({
                            name: album.songs[0].name,
                            length: album.songs[0].length,
                            albumName: album.title,
                        });
                    }}
                />
            ))}
        </div>
    </div>
);
