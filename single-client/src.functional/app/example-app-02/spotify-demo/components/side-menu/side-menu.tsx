import { WC } from '../../../../../lib/jsx';
import { FC } from '../../../../../lib/models/functional-component';
import { history } from '../../../../../lib/common/router';
import { Link, signal } from '../../../../../lib/core/signal-core';
import './side-menu.scss';


const sections = [
    {
        type: 'icon-item-list',
        list : [
            {
                icon: 'fas fa-home',
                text: 'Home',
                path: '/home',
                active: true
            },
            {
                icon: 'fas fa-search',
                text: 'Search',
                path: '/search',
                active: false
            },
            {
                icon: 'fas fa-book',
                text: 'Your Library',
                path: '/library',
                active: false
            },
        ]
    },
    {
        type: 'icon-item-list',
        list : [
            // {
            //     icon: 'fas fa-home',
            //     text: 'Create Playlist',
            //     path: '/',
            //     active: false
            // },
            {
                icon: 'fas fa-search',
                text: 'Liked Songs',
                path: '/songs',
                active: false
            },
            // {
            //     icon: 'fas fa-book',
            //     text: 'Your Episodes',
            //     path: '/',
            //     active: false
            // },
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
                            <Link 
                                path={item.path}
                                tag={'li'}
                                className={item.active ? 'active' : ''}
                            >
                                <i className={item.icon}></i>
                                {item.text}
                            </Link>
                        ))
                    }
                </ul>
            </div>
        ))
        }
    </div>
  );
};

