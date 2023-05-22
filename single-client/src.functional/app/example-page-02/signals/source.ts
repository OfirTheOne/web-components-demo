import { signal, derivedSignal, resourceSignal } from "../../../lib/core/signal-core/create-signal";
import { getAlbums } from "../db";
import { IAlbumTrack } from "../model";


export const currentTrackStateSignal = signal({
    selectedTrack: null as (IAlbumTrack & { albumName: string }) | null,
    played: false,
    elapsedSeconds: 0
});

export const albumsListsSignal = resourceSignal(getAlbums)

// export const albumsListsSignal = signal<IAlbum[][]>([...albumChunks]);



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