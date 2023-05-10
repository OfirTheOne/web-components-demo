import { IAlbumTrack } from '../model';
import { albumsListsSignal, currentTrackStateSignal } from './source';

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


export const duplicateAlbums = () => {
    albumsListsSignal.setValue(curr => {
        return curr.concat([...curr]);
    })
  }
  

