import { CreateStateFactory } from "sig';
import { IAlbumTrack } from "../model";

export interface CurrentTrackState {
    selectedTrack: (IAlbumTrack & { albumName: string }) | null,
    played: boolean,
    elapsedSeconds: number,
    togglePlayTrack: () => void,
    setCurrentTrack: (track: (IAlbumTrack & {
        albumName: string;
    }) | null) => void,
}

export const currentTrackSlice: CreateStateFactory<CurrentTrackState> = (set, get) => {
    return {
        selectedTrack: null as (IAlbumTrack & { albumName: string }) | null,
        played: false,
        elapsedSeconds: 0,
    
        togglePlayTrack: () => {
            set((current) => ({
                ...current,
                played: !current.played,
            }));
        },
        
        setCurrentTrack: (track: (IAlbumTrack & {albumName: string}) | null) => {
            set({ selectedTrack: track, });
        }    
    };
}
