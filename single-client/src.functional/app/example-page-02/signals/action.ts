import { Album, AlbumTrack } from '../model';
import { currentTrackStateSignal } from './source';

export const togglePlayTrack = () => {
    currentTrackStateSignal.setValue((current) => ({
        ...current,
        played: !current.played,
    }));
}

export const setCurrentTrack = (track: (AlbumTrack & {albumName: string}) | null) => {
  currentTrackStateSignal.setValue((current) => ({
      ...current,
      selectedTrack: track,
  }));
}
