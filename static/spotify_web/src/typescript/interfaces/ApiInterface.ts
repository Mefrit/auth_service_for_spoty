import { DefaultRequest } from "./DefaultInterface";
export interface ApiInterface {
    loadSong(songId: string, clientId: string): Promise<object | unknown>;
    loadPlayList(playListId: string, clientId: string): Promise<object | unknown>;
    getDataFromApi(url: string): Promise<DefaultRequest | unknown>;
}
