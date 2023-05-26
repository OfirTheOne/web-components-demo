import { WC } from '../../../../lib/jsx';
import { Routes } from '../routes/routes';
import { SpotifySideMenu } from '../components/side-menu/side-menu';
import MediaPlayerBar from '../components/media-player-bar/media-player-bar';
import { albumsListsSignal, currentTrackData } from '../../signals';
import { signalComponent } from '../../../../lib/core/signal-core';
import { onMount } from '../../../../lib/core/signal-core/hooks/on-mount';
import './layout.scss';


export const Layout = signalComponent(function Layout() {

  onMount(() => {
    albumsListsSignal.run();
  });

  return (
    <div className='layout'>
      <SpotifySideMenu />
      <Routes />
      <MediaPlayerBar
        trackPlayed={currentTrackData.played}
        trackLength={currentTrackData.length}
        trackElapsedTime={currentTrackData.elapsedTime}
        trackAlbumName={currentTrackData.albumName}
        trackName={currentTrackData.name}
      />
    </div>
  );
})



