import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { SpotifyAlbum, SpotifyAlbumProps } from './../album/spotify-album';
import { SpotifySideMenu } from './../side-menu/spotify-side-menu';
import MediaPlayerBar from './../media-player-bar/media-player-bar';
import { currentTrackData, currentTrackState } from '../../signals';
import './spotify-front-page.scss';

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
            <MediaPlayerBar 
                trackPlayed={currentTrackState.played}
                trackLength={currentTrackData.length}
                trackElapsedTime={currentTrackState.elapsedTime}
                trackArtistName={currentTrackData.artist}
                trackName={currentTrackData.name}
            />
        </div>
    </>
);


