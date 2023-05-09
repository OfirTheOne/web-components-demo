import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import './footer.scss';

const Footer: FC = () => {
  return (
    <footer className="spotify-footer">
      <div className="spotify-footer-content">
        <div className="spotify-footer-left">
          <img src="/spotify-logo.png" alt="Spotify" className="spotify-footer-logo" />
          <p className="spotify-footer-text">© 2023 Spotify AB</p>
        </div>
        <div className="spotify-footer-right">
          <a href="#">Legal</a>
          <a href="#">Privacy Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookies</a>
          <a href="#">About Ads</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
