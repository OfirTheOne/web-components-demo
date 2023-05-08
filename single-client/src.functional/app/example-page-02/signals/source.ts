import { signal, derivedSignal } from "../../../lib/core/signal-core/create-signal/create-signal";
import { Album, AlbumTrack } from "../model";
import { splitToChunks } from "../utils";
import { mockAlbums } from "./mock-data";


// const currentTrackDataSignal = signal({
//     name: '',
//     albumName: 'Nirvanaaa',
//     length: (60 * 4 + 20),
// });

export const currentTrackStateSignal = signal({
    selectedTrack: null as (AlbumTrack & { albumName: string }) | null,
    played: false,
    elapsedSeconds: 0
});

const albumChunks: Album[][] = mockAlbums;

export const albumsListsSignal = signal<Album[][]>([...albumChunks]);

export const currentTrackData = {
    source: currentTrackStateSignal,
    name: derivedSignal(currentTrackStateSignal, (source) => source.selectedTrack?.name || null),
    albumName: derivedSignal(currentTrackStateSignal, (source) => source.selectedTrack?.albumName || null),
    length: derivedSignal(currentTrackStateSignal, (source) => source.selectedTrack?.length ? 
      secondsToMinutes(source.selectedTrack.length) : null),
    played: derivedSignal(currentTrackStateSignal, (source) => source.played),
    elapsedTime: derivedSignal(currentTrackStateSignal, (source) => secondsToMinutes(source.elapsedSeconds)),
}


const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds}`;
}