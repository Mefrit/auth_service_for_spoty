import { SettingsInterface, SongData } from "./defaultInterface";
import { ApiInterface } from "./ApiInterface";
export interface MainPageInterface {
    userInfoDom: HTMLElement;
    albumsContent: HTMLElement;
    api?: ApiInterface;
    player: { play(data: SongData): void };
    settings: SettingsInterface;
    songInfoPlayer: HTMLElement;
    registrationLink: HTMLElement;
    playsBtn: HTMLCollection;
}
