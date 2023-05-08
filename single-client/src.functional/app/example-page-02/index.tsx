import { WC } from '../../lib/jsx';
import { SpotifyFrontPage } from './spotify-demo/front-page/spotify-front-page';
import { albumsListsSignal } from './signals';


export function ExamplePage02() {
  return (
    <div>
      {/* <SideMenu /> */}
      <SpotifyFrontPage albumsLists={albumsListsSignal} />
      {/* <ThemeSwitchButton /> 
      <Counter initialCount={0} />
      <Game /> */}
    </div>
  );
}



