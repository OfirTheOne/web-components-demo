import { IAlbumTrack } from '../model';
import { currentTrackStateSignal } from './source';

export const togglePlayTrack = () => {
    currentTrackStateSignal.setValue((current) => ({
        ...current,
        played: !current.played,
    }));
}

export const setCurrentTrack = (track: (IAlbumTrack & {albumName: string}) | null) => {
  currentTrackStateSignal.setValue((current) => ({
      ...current,
      selectedTrack: track,
  }));
}


  

