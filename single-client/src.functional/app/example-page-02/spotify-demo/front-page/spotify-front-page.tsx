import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { SpotifyAlbum, SpotifyAlbumProps } from './../album/spotify-album';
import { SpotifySideMenu } from './../side-menu/spotify-side-menu';
import MediaPlayerBar from './../media-player-bar/media-player-bar';
import { currentTrackData } from '../../signals';
import { Signal, Slot } from '../../../../lib/core/signal-core';
import './spotify-front-page.scss';


export interface SpotifyFrontPageProps {
    albums: Signal<SpotifyAlbumProps[]>;
}




export const SpotifyFrontPage: FC<SpotifyFrontPageProps> = ({ albums }) => (
    <>
        <div className='spotify-front-page'>
            <SpotifySideMenu />
            <h1>New Releases</h1>
            <div className='spotify-albums'>
                <Slot track={[albums]} >
                    {(albumsList: SpotifyAlbumProps[]) => {
                    return <>{           
                         (albumsList.map((album) => (
                            <SpotifyAlbum { ...album} />
                        )))
                     }
                    </>
                    }}
                </Slot>
            </div>
            <MediaPlayerBar 
                trackPlayed={currentTrackData.played}
                trackLength={currentTrackData.length}
                trackElapsedTime={currentTrackData.elapsedTime}
                trackAlbumName={currentTrackData.albumName}
                trackName={currentTrackData.name}
            />
        </div>
    </>
);


