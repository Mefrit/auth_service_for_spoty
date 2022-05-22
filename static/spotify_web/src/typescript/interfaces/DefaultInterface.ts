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
    clientId: string;
    api_key: string;
    secret: string;
    api_base: string;
    code: string;
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
