import { signal, derivedSignal } from "../../../lib/core/signal/create-signal/create-signal";


const currentTrackDataSignal = signal({
    name: 'Songg111',
    artist: 'Nirvanaaa',
    length: (60 * 4 + 20),
});

const currentTrackStateSignal = signal({
    played: false,
    elapsedSeconds: 0
});


export const currentTrackData = {
    source: currentTrackDataSignal,
    name: derivedSignal(currentTrackDataSignal, (source) => source.name),
    artist: derivedSignal(currentTrackDataSignal, (source) => source.artist),
    length: derivedSignal(currentTrackDataSignal, (source) => secondsToMinutes(source.length)),
}


export const currentTrackState = {
    source: currentTrackDataSignal,
    played: derivedSignal(currentTrackStateSignal, (source) => source.played),
    elapsedTime: derivedSignal(currentTrackStateSignal, (source) => secondsToMinutes(source.elapsedSeconds)),
}


export const togglePlayTrack = () => {
    currentTrackStateSignal.setValue((current) => ({
        ...current,
        played: !current.played,
    }));
}

const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds}`;
}