import { signal } from '../../../../lib/core/signal-core';
import { WC } from '../../../../lib/jsx';
import { FC } from '../../../../lib/models/functional-component';
import './spotify-side-menu.scss';


const sections = [
    {
        type: 'icon-item-list',
        list : [
            {
                icon: 'fas fa-home',
                text: 'Home',
                active: true
            },
            {
                icon: 'fas fa-search',
                text: 'Search',
                active: false
            },
            {
                icon: 'fas fa-book',
                text: 'Your Library',
                active: false
            },
        ]
    },
    {
        type: 'icon-item-list',
        list : [
            {
                icon: 'fas fa-home',
                text: 'Create Playlist',
                active: true
            },
            {
                icon: 'fas fa-search',
                text: 'Liked Songs',
                active: false
            },
            {
                icon: 'fas fa-book',
                text: 'Your Episodes',
                active: false
            },
        ]
    },
];


const resizeOffset = signal<number | null>(null);
const sideMenuWidth  = signal('250px');

const handleResizeStart = (event) => {
    resizeOffset.setValue(() => (event.clientX as number));
};

const handleResizeEnd = () => {
    resizeOffset.setValue(() => null);
};

const handleResizeMove = (event) => {
    if (resizeOffset.value !== null) {
        const delta = event.clientX - resizeOffset.value;
        const newWidth = Math.max(200, document.body.clientWidth - delta);
        sideMenuWidth.setValue(() => `${newWidth}px`);
    } else {
        sideMenuWidth.setValue(() =>  '250px');
    }
};

export const SpotifySideMenu: FC = () => {
  return (
    <div className="side-menu">
        { 
        sections.map((section) => (
            <div className={section.type}>
                <ul>
                    {
                        section.list.map((item) => (
                            <li className={item.active ? 'active' : ''}>
                                <i className={item.icon}></i>
                                {item.text}
                            </li>
                        ))
                    }
                </ul>
            </div>
        ))
        }
    </div>
  );
};

