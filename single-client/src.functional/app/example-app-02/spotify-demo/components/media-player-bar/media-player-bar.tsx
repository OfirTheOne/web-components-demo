import { WC } from '../../../../../lib/jsx';
import { FC } from '../../../../../lib/models/functional-component';
import { IDecoratedSignal, Show, signalComponent } from '../../../../../lib/core/signal-core';
import { signalStore } from '../../../store';
import './media-player-bar.scss';

// interface MediaPlayerBarProps {
//     trackName: IDecoratedSignal<string>;
//     trackAlbumName: IDecoratedSignal<string>;
//     trackLength: IDecoratedSignal<string>;
//     trackPlayed: IDecoratedSignal<boolean>;
//     trackElapsedTime: IDecoratedSignal<string>;
// }

const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds}`;
}
export const MediaPlayerBar: FC = signalComponent(function MediaPlayerBar() {
    const { togglePlayTrack } = signalStore.getStore().getState();
    const trackName = signalStore.getSignal((state) => state.selectedTrack?.name || null)
    const trackAlbumName = signalStore.getSignal((state) => state.selectedTrack?.albumName || null)
    const trackLength =     signalStore.getSignal((state) => state.selectedTrack?.length ?
        secondsToMinutes(state.selectedTrack.length) : null)
    const trackPlayed =     signalStore.getSignal((state) => state.played)
    // const trackElapsedTime =    signalStore.getSignal((state) => secondsToMinutes(state.elapsedSeconds))

    return (
        <div className='media-player-bar'>
            <div className='track-info'>
                <div className='track-info-text'>
                    <span className='track-name'>{trackName}</span>
                    <span className='track-album-name'>{trackAlbumName}</span>
                </div>
            </div>
            <div className='player-controls'>
                <button className='play-button' onClick={
                    () => {
                        togglePlayTrack();
                        console.log('play button clicked');
                    }
                }>
                    <Show
                        when={trackPlayed}
                        fallback= {<i className='fa fa-pause'></i>}
                    >
                        <i className='fa fa-play'></i>
                    </Show>
                    
                </button>

                <button className='skip-button'>
                    <i className='fa fa-fast-forward'></i>
                </button>
                <div className='progress-bar-container'>
                    <div className='progress-bar'></div>
                </div>
                <div className='time-labels'>
                    <span className='current-time'>0:00</span>
                    <span className='total-time'>{trackLength}</span>
                </div>
                <button className='volume-button'>
                    <i className='fa fa-volume-up'></i>
                </button>
            </div>
        </div>
    );
});
