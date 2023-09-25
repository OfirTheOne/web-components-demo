import { FC } from 'sig';
import { For } from 'sig';
import { onUnmount } from 'sig';
import { signalStore } from '../../../store';
import { IAlbum } from '../../../model';
import { AlbumList } from '../../components/album-list/album-list';
import { Footer } from '../../components/footer/footer';
import './home-page.scss';

export const HomePage: FC = () => {

    const albumsList = signalStore.select((state) => state.albumList);
    onUnmount(() => {
        console.log("HomePage onUnmount");
    });
    return (
        <div className='page-content-container'>
            <div className='page-content'>
                <h1>New Releases</h1>
                <div className='spotify-albums-section'>
                    <For each={albumsList} index>
                        { (list: IAlbum[]) => <AlbumList albums={list} /> }
                    </For>
                </div>
                <Footer />
            </div>
        </div>
    );
    }


