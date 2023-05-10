import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { SpotifySideMenu } from './../side-menu/spotify-side-menu';
import MediaPlayerBar from './../media-player-bar/media-player-bar';
import { currentTrackData } from '../../signals';
import { Signal, Slot } from '../../../../lib/core/signal-core';
import './spotify-front-page.scss';
import { IAlbum } from '../../model';
import { AlbumList } from '../album-list/album-list';
import Footer from '../footer/footer';

export interface SpotifyFrontPageProps {
    albumsLists: Signal<IAlbum[][]>;
}




export const SpotifyFrontPage: FC<SpotifyFrontPageProps> = ({ albumsLists }) => (
        <div className='spotify-front-page'>
            <SpotifySideMenu />
            <div className='page-content-container'>
                <div className='page-content'>
                    <h1>New Releases</h1>
                    <div className='spotify-albums-section'>
                        <Slot track={[albumsLists]} >
                            {(lists: IAlbum[][]) => 
                                (<>{ lists.map(list => 
                                    <AlbumList albums={list} />) 
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


