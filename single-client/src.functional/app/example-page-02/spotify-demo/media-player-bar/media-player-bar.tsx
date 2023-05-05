import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import { signalComponent } from '../../../../lib/core/signal/signal-component/signal-component';
import { DerivedSignal } from 'src.functional/lib/core/signal/models';
import './media-player-bar.scss';

interface MediaPlayerBarProps {
    trackName: DerivedSignal<string>;
    trackArtistName: DerivedSignal<string>;
    trackLength: DerivedSignal<string>;
    trackPlayed: DerivedSignal<boolean>;
    trackElapsedTime: DerivedSignal<string>;
}

const MediaPlayerBar: FC<MediaPlayerBarProps> = signalComponent(function MediaPlayerBar(props) {
    return (
        <div className='media-player-bar'>
            <div className='track-info'>
                <img src='https://i.scdn.co/image/ab67616d0000b273e3b4b5b6b5b6b5b6b5b6b5b6' alt='album cover' />
                <div className='track-info-text'>
                    <span className='track-name'>{props.trackName}</span>
                    <span className='track-artist-name'>{props.trackArtistName}</span>
                </div>
            </div>

            <div className='player-controls'>
                <button className='play-button'>
                    <i className='fa fa-play'></i>
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
