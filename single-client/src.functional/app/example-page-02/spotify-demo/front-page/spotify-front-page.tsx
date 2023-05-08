import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { SpotifyAlbum, SpotifyAlbumProps } from './../album/spotify-album';
import { SpotifySideMenu } from './../side-menu/spotify-side-menu';
import MediaPlayerBar from './../media-player-bar/media-player-bar';
import { currentTrackData } from '../../signals';
import { Signal, Slot } from '../../../../lib/core/signal-core';
import './spotify-front-page.scss';
import { Album } from '../../model';
import { SpotifyAlbumList } from '../album-list/album-list';


export interface SpotifyFrontPageProps {
    albumsLists: Signal<Album[][]>;
}




export const SpotifyFrontPage: FC<SpotifyFrontPageProps> = ({ albumsLists }) => (
    <>
        <div className='spotify-front-page'>
            <SpotifySideMenu />
            <h1>New Releases</h1>
            <div className='spotify-albums'>
                <Slot track={[albumsLists]} >
                    {(lists: Album[][]) => {
                    return (<>{    
                        lists.map(list => {
                            return <SpotifyAlbumList albums={list} />;
                        })
                    }</>)
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


