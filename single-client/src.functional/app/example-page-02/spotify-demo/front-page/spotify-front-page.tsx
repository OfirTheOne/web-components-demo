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
import Footer from '../footer/footer';


export interface SpotifyFrontPageProps {
    albumsLists: Signal<Album[][]>;
}




export const SpotifyFrontPage: FC<SpotifyFrontPageProps> = ({ albumsLists }) => (
        <div className='spotify-front-page'>
            <SpotifySideMenu />
            <div className='page-content-container'>
                <div className='page-content'>
                    <h1>New Releases</h1>
                    <div className='spotify-albums-section'>
                        <Slot track={[albumsLists]} >
                            {(lists: Album[][]) => 
                                (<>{ lists.map(list => 
                                    <SpotifyAlbumList albums={list} />) 
                                }</>)
                            }
                        </Slot>
                    </div>
                    <Footer />
                </div>
            </div>
            <MediaPlayerBar 
                trackPlayed={currentTrackData.played}
                trackLength={currentTrackData.length}
                trackElapsedTime={currentTrackData.elapsedTime}
                trackAlbumName={currentTrackData.albumName}
                trackName={currentTrackData.name}
            />
        </div>
);


