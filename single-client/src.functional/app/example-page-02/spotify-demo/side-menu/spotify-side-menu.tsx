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

