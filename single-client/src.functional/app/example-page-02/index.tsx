import { WC } from '../../lib/jsx';
import { useTheme } from './../providers';
import { Game, ThemeSwitchButton } from './../components';
import { createMemo, useAsync } from '../../lib/core';
import { SideMenu } from './../components/side-menu/side-menu';
import { signalComponent } from '../../lib/core/signal/signal-component/signal-component';
import { createSignal, derivedSignal } from '../../lib/core/signal/create-signal/create-signal';
import { Signal } from '../../lib/core/signal/models';
import { SpotifyFrontPage } from './spotify-demo/front-page/spotify-front-page';


const albums = [
  {
    image: 'https://picsum.photos/300/300',
    title: 'Album Title 1',
    artist: 'Artist Name 1',
  },
  {
    image: 'https://picsum.photos/300/301',
    title: 'Album Title 2',
    artist: 'Artist Name 2',
  },
  {
    image: 'https://picsum.photos/300/302',
    title: 'Album Title 3',
    artist: 'Artist Name 3',
  },
  {
    image: 'https://picsum.photos/300/300',
    title: 'Album Title 4',
    artist: 'Artist Name 4',
  },
  {
    image: 'https://picsum.photos/300/301',
    title: 'Album Title 5',
    artist: 'Artist Name 5',
  },
  {
    image: 'https://picsum.photos/300/302',
    title: 'Album Title 6',
    artist: 'Artist Name 6',
  },
];

export function ExamplePage02() {
  return (
    <div>
      {/* <SideMenu /> */}
      <SpotifyFrontPage albums={albums} />
      {/* <ThemeSwitchButton /> 
      <Counter initialCount={0} />
      <Game /> */}
    </div>
  );
}



