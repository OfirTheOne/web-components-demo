

export interface Album {
    image: string;
    title: string;
    artist: string;
    songs: AlbumTrack[];
} 


export interface AlbumTrack {
    name: string;
    length: number;
} 