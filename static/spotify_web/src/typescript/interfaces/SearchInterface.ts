import { SettingsInterface, PlayerInterfaceInput } from "./DefaultInterface";
import { ApiInterface } from "./ApiInterface";
export interface SearchInterface {
    userInfoDom: HTMLElement;
    songs: HTMLElement;
    api: ApiInterface;
    player: PlayerInterfaceInput;
    settings: SettingsInterface;
    songInfoPlayer: HTMLElement;
    playsBtn: HTMLCollection;
    search_string_dom: HTMLElement;
    searchBtn: HTMLElement;
    albumsContent: HTMLElement;
}
