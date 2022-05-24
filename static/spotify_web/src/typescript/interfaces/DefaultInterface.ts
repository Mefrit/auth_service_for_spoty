export interface DefaultRequest {
    result: boolean;
    data?: any;
    message?: string | unknown;
}
export interface DefaultJumendoRequest {
    headers: { code: number; error_message: string; results_count?: number; status: string; warnings: string };
    results: any[];
}
export interface SettingsInterface {
    CLIENT_ID: string;
    API_KEY: string;
    SECRET: string;
    API_BASE: string;
    CODE: string;
}
export interface SongData {
    id: string;
    index: number;
    isAlbum: boolean;
    isArtist: boolean;
    url: string;
    isPlaylist?: boolean;
}
export interface GetUserInfoInterface {
    result: boolean;
    user?: any;
    message?: string;
}
export interface PlayerInterfaceInput {
    play(data: SongData): void;
}
export interface URLInterface {
    artist_id: string;
    mode: string;
    playListId?: string;
}
