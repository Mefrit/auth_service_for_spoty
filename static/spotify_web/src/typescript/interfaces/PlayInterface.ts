import { SettingsInterface, PlayerInterfaceInput } from "./DefaultInterface";
import { ApiInterface } from "./ApiInterface";
export interface PlayInterface {
    userInfoDom: HTMLElement;
    songs: HTMLElement;
    api: ApiInterface;
    player: PlayerInterfaceInput;
    settings: SettingsInterface;
    urlParams: {
        [key: string]: string;
    };
}
