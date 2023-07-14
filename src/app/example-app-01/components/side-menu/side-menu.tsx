import { createCallback, createState, memo, useEffect } from '../../../../lib/core';
import './side-menu.scss';


const SideMenu = () => {
    const [isOpen, setIsOpen] = createState(false);
    const [isExpanded, setIsExpanded] = createState(false);
    const [resizeOffset, setResizeOffset] = createState(null);
    const [sideMenuWidth, setSideMenuWidth] = createState('250px');

    
    
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

    const handleResizeStart = (event) => {
        setResizeOffset(event.clientX);
    };

    const handleResizeEnd = () => {
        setResizeOffset(null);
    };

    const handleResizeMove = (event) => {
        if (resizeOffset() !== null) {
            const delta = event.clientX - resizeOffset();
            const newWidth = Math.max(200, document.body.clientWidth - delta);
            setSideMenuWidth(`${newWidth}px`);
        } else {
          setSideMenuWidth('250px')

        }
    };
    useEffect(() => {
        if (resizeOffset() !== null) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeEnd);
        } else {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);
        }
    }, [resizeOffset()]);

    return (
        <div className={`side-menu ${isOpen() ? 'open' : ''} ${isExpanded() ? 'expanded' : ''}`}>
              <div className="resize-bar" onMouseDown={handleResizeStart} 
              style={{'--side-menu-width':  sideMenuWidth()}}></div>

            <button className='toggle-btn' onClick={toggleMenu}>
                {isOpen() ? 'Close Menu' : 'Open Menu'}
            </button>
            <nav onMouseEnter={expandMenu} onMouseLeave={shrinkMenu}>
                <ul>
                    <li>
                        <a href='#' >Link 1</a>
                    </li>
                    <li>
                        <a href='#'>Link 2</a>
                    </li>
                    <li>
                        <a href='#'>Link 3</a>
                    </li>
                    <li>
                        <a href='#'>Link 4</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

const MemoSideMenu = memo(SideMenu);

export { MemoSideMenu as SideMenu };
