import { WC } from '../../../lib/jsx';
import { FC } from '../../../lib/models/functional-component';
import './media-player-bar.scss';

const MediaPlayerBar: FC = () => {
  return (
    <div className="media-player-bar">
      <div className="player-controls">
        <button className="play-button">
          <i className="fa fa-play"></i>
        </button>
        <button className="skip-button">
          <i className="fa fa-fast-forward"></i>
        </button>
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
        <div className="time-labels">
          <span className="current-time">0:00</span>
          <span className="total-time">4:20</span>
        </div>
        <button className="volume-button">
          <i className="fa fa-volume-up"></i>
        </button>
      </div>
    </div>
  );
};

export default MediaPlayerBar;
