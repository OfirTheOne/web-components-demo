import { WC } from '../../../lib/jsx';
import { createCallback, createState, memo } from '../../../lib/core';
import './side-menu.scss';

const SideMenu = () => {

      const [isOpen, setIsOpen] = createState(false);
      const [isExpanded, setIsExpanded] = createState(false);
    
      const toggleMenu = () => {
        setIsOpen(!isOpen());
        setIsExpanded(false);
      };
    
      const expandMenu = () => {
        setIsExpanded(true);
      };
    
      const shrinkMenu = () => {
        setIsExpanded(false);
      };
    
      return (
        <div className={`side-menu ${isOpen() ? 'open' : ''} ${isExpanded() ? 'expanded' : ''}`}>
          <button className="toggle-btn" onClick={toggleMenu}>
            {isOpen() ? 'Close Menu' : 'Open Menu'}
          </button>
          <nav onMouseEnter={expandMenu} onMouseLeave={shrinkMenu}>
            <ul>
              <li><a href="#">Link 1</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
              <li><a href="#">Link 4</a></li>
            </ul>
          </nav>
        </div>
      );
    };
    
    

const MemoSideMenu = memo(SideMenu);

export { MemoSideMenu as SideMenu };
