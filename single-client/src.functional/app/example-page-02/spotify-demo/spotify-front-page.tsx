import { WC } from '../../../lib/jsx';
import { FC } from 'src.functional/lib/models/functional-component';
import { SpotifyAlbum, SpotifyAlbumProps } from './spotify-album';
import './spotify-front-page.scss';
import { SpotifySideMenu } from './spotify-side-menu';
import MediaPlayerBar from './media-player-bar';

export interface SpotifyFrontPageProps {
    albums: SpotifyAlbumProps[];
}

export const SpotifyFrontPage: FC<SpotifyFrontPageProps> = ({ albums }) => (
    <>
        <div className='spotify-front-page'>
            <SpotifySideMenu />
            <h1>New Releases</h1>
            <div className='spotify-albums'>
                {albums.map((album) => (
                    <SpotifyAlbum
                        //   key={album.title}
                        image={album.image}
                        title={album.title}
                        artist={album.artist}
                    />
                ))}
            </div>
            <MediaPlayerBar />
        </div>
    </>
);


