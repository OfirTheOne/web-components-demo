import { CreateStateFactory } from "@lib/core/signal-core/store/types";
import { getAlbums } from "../db";
import { IAlbum } from "../model";

export interface AlbumState {
    albumList: IAlbum[][],
    fetchAlbums: () => Promise<IAlbum[][]>
}

export const albumSlice: CreateStateFactory<AlbumState> = (set, get) => {
    return {
        albumList: [],
        fetchAlbums: async () => {
            const albums = await getAlbums();
            set({ albumList: albums });
            return albums;
        },
    };
}
