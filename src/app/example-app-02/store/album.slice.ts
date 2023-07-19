import { CreateStateFactory } from "@lib/common/store/types";
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
