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
    artistName: string;
    id?: string;
    image?: string;
    albumImage?: string;
    albumName?: string;
    name?: string;
    audio?: string;
}
