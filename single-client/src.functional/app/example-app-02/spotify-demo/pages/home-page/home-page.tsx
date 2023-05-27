import { WC } from '../../../../../lib/jsx';
import { FC } from '../../../../../lib/models/functional-component';
import { For } from '../../../../../lib/core/signal-core';
import { IAlbum } from '../../../model';
import { AlbumList } from '../../components/album-list/album-list';
import Footer from '../../components/footer/footer';
import { albumsListsSignal } from '../../../signals';
import './home-page.scss';
import { onUnmount } from '../../../../../lib/core/signal-core/hooks';

export const HomePage: FC = () => {

    onUnmount(() => {
        console.log("HomePage onUnmount");
    });
    return (
        <div className='page-content-container'>
            <div className='page-content'>
                <h1>New Releases</h1>
                <div className='spotify-albums-section'>
                    <For each={albumsListsSignal} index>
                        { (list: IAlbum[]) => <AlbumList albums={list} /> }
                    </For>
                </div>
                <Footer />
            </div>
        </div>
    );
    }


