import { signalStore } from '../../store';
import { signalComponent } from '../../../../lib/core/signal-core';
import { onMount } from '../../../../lib/core/signal-core/hooks';
import { Routes } from '../routes/routes';
import { SpotifySideMenu } from '../components/side-menu/side-menu';
import { MediaPlayerBar } from '../components/media-player-bar/media-player-bar';
import './layout.scss';


export const Layout = signalComponent(function Layout() {

  const { fetchAlbums } = signalStore.getState();
  onMount(() => {
    fetchAlbums();
  });

  return (
    <div className='layout'>
      <SpotifySideMenu />
      <Routes />
      <MediaPlayerBar />
    </div>
  );
})



