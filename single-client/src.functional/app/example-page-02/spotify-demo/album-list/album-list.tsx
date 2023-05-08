import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { Album } from '../../model';
import { setCurrentTrack } from '../../signals/action';
import { SpotifyAlbum } from '../album/spotify-album';
import './album-list.scss'
export type SpotifyAlbumListProps = {
    albums: Album[];
};

export const SpotifyAlbumList: FC<SpotifyAlbumListProps> = ({ albums }) => (
    <div className='spotify-album-list'>
        {albums.map((album) => (
            <SpotifyAlbum
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
);
//   <div key={album.title} className="spotify-album-list-item">
//     <img src={album.image} alt={album.title} className="spotify-album-list-item-image" />
//     <div className="spotify-album-list-item-details">
//       <h3 className="spotify-album-list-item-title">{album.title}</h3>
//       <p className="spotify-album-list-item-artist">{album.artist}</p>
//     </div>
//     <button
//       className="spotify-album-list-item-play"
//       onClick={() =>
//         setCurrentTrack({
//           name: album.songs[0].name,
//           length: album.songs[0].length,
//           albumName: album.title,
//         })
//       }
//     >
//       <svg viewBox="0 0 512 512">
//         <path d="M469.333,234.667L74.667,6.5C59.5-3.833,42.667,2,42.667,21.167v469.333c0,19.167,16.833,25,32.333,14.833 l394.667-228.167c10.833-6.333,10.833-17.167,0-23.5z" />
//       </svg>
//     </button>
//   </div>
// ))}
