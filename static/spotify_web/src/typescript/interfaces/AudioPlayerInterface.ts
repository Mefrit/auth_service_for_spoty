import { SettingsInterface } from "./DefaultInterface";
import { ApiInterface } from "./ApiInterface";
export interface AudioPlayerInterface {
    audioPlayer: HTMLAudioElement;
    api: ApiInterface;
    settings: SettingsInterface;
    songInfoPlayer: HTMLElement;
    playPause: HTMLElement;
    playBack: HTMLElement;
    playForward: HTMLElement;
    playProgress: HTMLInputElement;
    playVolume: HTMLElement;
    playSoundMute: HTMLElement;
    timeStart: HTMLElement;
    timeEnd: HTMLElement;
    playSvgPath: HTMLElement;
}
