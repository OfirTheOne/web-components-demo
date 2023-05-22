import { WC } from '../../../../../lib/jsx';
import { FC } from '../../../../../lib/models/functional-component';
import { DerivedSignal, Show, signalComponent } from '../../../../../lib/core/signal-core';
import { togglePlayTrack } from '../../../signals';
import './media-player-bar.scss';

interface MediaPlayerBarProps {
    trackName: DerivedSignal<string>;
    trackAlbumName: DerivedSignal<string>;
    trackLength: DerivedSignal<string>;
    trackPlayed: DerivedSignal<boolean>;
    trackElapsedTime: DerivedSignal<string>;
}

const MediaPlayerBar: FC<MediaPlayerBarProps> = signalComponent(function MediaPlayerBar(props) {
    return (
        <div className='media-player-bar'>
            <div className='track-info'>
                <div className='track-info-text'>
                    <span className='track-name'>{props.trackName}</span>
                    <span className='track-album-name'>{props.trackAlbumName}</span>
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
                        when={props.trackPlayed}
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
                    <span className='total-time'>{props.trackLength}</span>
                </div>
                <button className='volume-button'>
                    <i className='fa fa-volume-up'></i>
                </button>
            </div>
        </div>
    );
});

export default MediaPlayerBar;
