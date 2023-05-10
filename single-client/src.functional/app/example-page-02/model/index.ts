

export interface IAlbum {
    image: string;
    title: string;
    artist: string;
    songs: IAlbumTrack[];
} 


export interface IAlbumTrack {
    name: string;
    length: number;
} 