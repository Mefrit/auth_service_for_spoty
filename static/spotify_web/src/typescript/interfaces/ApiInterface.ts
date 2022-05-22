import { DefaultRequest } from "./defaultInterface";
export interface ApiInterface {
    loadSong(songId: string, clientId: string): Promise<object | any>;
    loadPlayList(playListId: string, clientId: string): Promise<object | any>;
    getDataFromApi(url: string): Promise<DefaultRequest | any>;
}
