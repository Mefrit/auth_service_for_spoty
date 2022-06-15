import {songInPlayList} from "./DefaultInterface"
export interface PlayListInterface {
    list: PlayListItemInterface[];
    title: string;
    type: string;
    url: string;
}
export interface PlayListItemInterface {
    musicinfo?: { tags: { genres: object[]; instruments: object[] } };
    releasedate?: string;
    creationdate?: string;
    artist_name: string;
    id: string;
    image?: string;
    albumImage?: string;
    albumName?: string;
    name?: string;
    audio?: string;
}
export interface PlayListItemJumendoInterface {
    musicinfo?: { tags: { genres: object[]; instruments: object[] } };
    releasedate?: string;
    creationdate?: string;
    artist_name: string;
    id?: string;
    image: string;
    album_image: string;
    album_name: string;
    name: string;
    audio: string;
}
export interface playListPropsInterface {  
    setSong: (song: number) => void,
    item:PlayListItemJumendoInterface, 
    type:string ,
    url:string,
    index:number
}
export interface PlayListProps {
    setSong: (song: number) => void
    list: PlayListItemInterface[]
    title: string
    type: string
    url: string
}