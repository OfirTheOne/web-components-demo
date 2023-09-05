import { FC } from 'sig';
import './footer.scss';

export const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src="/logo.png" alt="Spotify" className="footer-logo" />
          <p className="footer-text">© 2023 Spotify AB</p>
        </div>
        <div className="footer-right">
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

