import { createSignalStore } from "sig';
import { AlbumState, albumSlice } from "./album.slice";
import { CurrentTrackState, currentTrackSlice } from "./current-track.slice";


export type RootState 
    = AlbumState 
    & CurrentTrackState;

export const signalStore = createSignalStore<RootState>((set, get) => {
    return {
        ...albumSlice(set, get),
        ...currentTrackSlice(set, get)  
    };
});

