import { getParams } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";

class Search {
    user_info_dom: HTMLElement;
    songs_dom: HTMLElement;
    api: any;
    player: any;
    albumsContent: HTMLElement;
    settings: any;
    urlParams: any;
    search_string: string;
    search_mode_select: HTMLElement | null;
    search_btn: HTMLElement | null;
    search_string_dom: HTMLElement | null;
    search_mode: string;
    constructor(conf: any) {
        this.user_info_dom = conf.user_info_dom;
        this.songs_dom = conf.songs;

        this.search_string_dom = search_string;
        this.search_mode_select = search_mode_select;
        this.search_btn = search_btn;

        this.api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
        this.urlParams = conf.urlParams;
        this.albumsContent = conf.albumsContent;
        this.search_mode = "name_song";
        this.search_string = "";
    }
    playMusic = (ev: any) => {
        const songData = JSON.parse(ev.target.getAttribute("data-info-music"));
        this.player.play(songData);
    };
    createBackLink() {
        return "<a href='/'>Назад</a>";
    }
    initPlaySongEvents() {
        // вынести
        const playsBtn: any = document.getElementsByClassName("play-btn");
        if (playsBtn) {
            for (var i = 0; i < playsBtn.length; i++) {
                playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    startSearch = () => {
        const url_search =
            `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&limit=40&search=` +
            this.search_string_dom.value.trim();
        this.albumsContent.innerHTML = "<p>Поиск...</p>";
        this.api.getDataFromApi(url_search).then((data: any) => {
            this.albumsContent.innerHTML = "";
            const playlist = new PlayList({
                list: data.data,
                title: "Найденные композиции",
                type: "track",
                url: url_search,
            });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
            const playsBtn: any = document.getElementsByClassName("play-btn");
            this.initListenMusicEvent(playsBtn);
        });
    };
    initListenMusicEvent(playsBtn: any) {
        if (playsBtn) {
            for (var i = 0; i < playsBtn.length; i++) {
                playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    initSearchEvents() {
        this.search_btn.addEventListener("click", this.startSearch);
    }
    async init() {
        // вход
        this.initSearchEvents();
    }
    async start() {
        this.init();
    }
}

const user_info_dom = document.getElementById("user-info");
const songs = document.getElementById("songs");
const audioPlayer = document.getElementById("audio-player");
const songInfoPlayer = document.getElementById("song-info-player");

const search_string = document.getElementById("search-string");
const search_mode_select = document.getElementById("search-mode");
const search_btn = document.getElementById("search-btn");
const albumsContent = document.getElementById("albums-content");

const playPause = document.getElementById("play-pause");
const playBack = document.getElementById("play-back");
const playForward = document.getElementById("play-forward");
const playProgress = document.getElementById("play-progress");
const playSoundMute = document.getElementById("play-sound-mute");
const playVolume = document.getElementById("play-volume");
const play_timeStart = document.getElementById("play-time-start");
const play_timeEnd = document.getElementById("play-time-end");
const playSvgPath = document.getElementById("playSvgPath");
const urlParams = getParams(window.location);

const Api_object = new Api();
const player = new AudioPlayer({
    audioPlayer: audioPlayer,
    api: Api_object,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    playPause: playPause,
    playBack: playBack,
    playForward: playForward,
    playProgress: playProgress,
    playVolume: playVolume,
    playSoundMute: playSoundMute,
    timeStart: play_timeStart,
    timeEnd: play_timeEnd,
    playSvgPath: playSvgPath,
});
const main = new Search({
    user_info_dom: user_info_dom,
    songs: songs,
    api: Api_object,
    player: player,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    urlParams: urlParams,
    search_string: search_string,
    search_mode_select: search_mode_select,
    search_btn: search_btn,
    albumsContent: albumsContent,
});
main.init();
