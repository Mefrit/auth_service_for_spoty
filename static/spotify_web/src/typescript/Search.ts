import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";
import { setUserInfoFromStorage } from "./lib/reqistration";
import {
    userInfoDom,
    searchBtn,
    albumsContent,
    audioPlayer,
    songInfoPlayer,
    playPause,
    playBack,
    playForward,
    playProgress,
    playSoundMute,
    playVolume,
    playTimeStart,
    playSvgPath,
    playTimeEnd,
    songs,
    playsBtn,
    searchStringDom,
    registrationLink,
} from "./lib/domInit";
import { SettingsInterface, PlayerInterfaceInput, DefaultRequest } from "./interfaces/DefaultInterface";
import { SearchInterface } from "./interfaces/SearchInterface";
import { ApiInterface } from "./interfaces/ApiInterface";

class Search {
    userInfoDom: HTMLElement;
    songsDom: HTMLElement;
    Api: ApiInterface;
    player: PlayerInterfaceInput;
    albumsContent: HTMLElement;
    settings: SettingsInterface;
    search_string: string;
    searchBtn: HTMLElement;
    searchStringDom: HTMLElement;
    playsBtn: HTMLCollection;
    search_mode: string;
    constructor(conf: SearchInterface) {
        this.userInfoDom = conf.userInfoDom;
        this.songsDom = conf.songs;
        this.searchStringDom = conf.searchStringDom;
        this.searchBtn = conf.searchBtn;

        this.Api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
        this.playsBtn = conf.playsBtn;
        this.albumsContent = conf.albumsContent;
        this.search_mode = "name_song";
        this.search_string = "";
    }
    playMusic = (ev: Event) => {
        if (ev.target) {
            const el = ev.target as HTMLInputElement;
            const songSetting = el.getAttribute("data-info-music");
            if (songSetting) {
                const songData = JSON.parse(songSetting);
                this.player.play(songData);
            }
        }
    };
    createBackLink() {
        return "<a href='/'>Назад</a>";
    }
    initPlaySongEvents() {
        // вынести

        if (this.playsBtn) {
            for (var i = 0; i < this.playsBtn.length; i++) {
                this.playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    startSearch = () => {
        const value = (this.searchStringDom as HTMLInputElement).value;
        const url_search =
            `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&search=` +
            value.trim();
        this.albumsContent.innerHTML = "<p>Поиск...</p>";
        this.Api.getDataFromApi(url_search).then((data: DefaultRequest) => {
            this.albumsContent.innerHTML = "";
            const playlist = new PlayList({
                list: data.data,
                title: "Найденные композиции",
                type: "track",
                url: url_search,
            });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
            const playsBtn = document.getElementsByClassName("play-btn");
            this.initListenMusicEvent(playsBtn);
        });
    };
    initListenMusicEvent(playsBtn: HTMLCollection) {
        if (playsBtn) {
            for (var i = 0; i < playsBtn.length; i++) {
                playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    initSearchEvents() {
        this.searchBtn.addEventListener("click", this.startSearch);
        this.searchStringDom.addEventListener("keydown", (event) => {
            if (event.keyCode == 13) {
                event.preventDefault();
                this.startSearch();
            }
        });
    }
    setRegistrationLink() {
        registrationLink?.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.CLIENT_ID}&redirect_uri=http://localhost:4567/&response_type=code`
        );
    }
    async init() {
        // вход

        this.setRegistrationLink();
        if (localStorage.getItem("accessToken") !== "undefined") {
            setUserInfoFromStorage(userInfoDom, registrationLink);
        }
        this.initSearchEvents();
    }
    start() {
        this.init();
    }
}

const ApiObject: ApiInterface = new Api();

const player = new AudioPlayer({
    audioPlayer: audioPlayer,
    api: ApiObject,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    playPause: playPause,
    playBack: playBack,
    playForward: playForward,
    playProgress: playProgress,
    playVolume: playVolume,
    playSoundMute: playSoundMute,
    timeStart: playTimeStart,
    timeEnd: playTimeEnd,
    playSvgPath: playSvgPath,
});

const main = new Search({
    userInfoDom: userInfoDom,
    songs: songs,
    api: ApiObject,
    player: player,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    searchStringDom: searchStringDom,
    searchBtn: searchBtn,
    albumsContent: albumsContent,
    playsBtn: playsBtn,
});
main.init();
