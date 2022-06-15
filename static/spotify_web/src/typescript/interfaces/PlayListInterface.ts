import { songInPlayList } from "./DefaultInterface";
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
    name: string;
    audio: string;
}
export interface PlayListItemJumendoInterface {
    musicinfo?: { tags: { genres: object[]; instruments: object[] } };
    releasedate?: string;
    creationdate?: string;
    artist_name: string;
    id: number;
    image: string;
    album_image: string;
    album_name: string;
    name: string;
    audio: string;
    albumImage?: string;
    albumName?: string;
}
export interface playListPropsInterface {
    setSong: (song: PlayListItemJumendoInterface) => void;
    item: PlayListItemJumendoInterface;
    type: string;
    url: string;
    index: number;
}
export interface PlayListProps {
    setSong: (song: PlayListItemJumendoInterface) => void;
    list: PlayListItemJumendoInterface[];
    title: string;
    type: string;
    url: string;
}
export interface trackDataInterface {
    creationdate: string;
    id: number;
    name: string;
    shareurl: string;
    shorturl: string;
    user_id: string;
    user_name: string;
    zip: string;
    audio: string;
    artist_name: string;
    album_image: string;
}
export interface favoriteUserDataInterface {
    album_id: string;
    avatar: string;
    avatar_type: string;
    creationdate: string;
    dispname: string;
    id: string;
    lang: string;
    name: string;
    tracks: trackDataInterface[];
}
