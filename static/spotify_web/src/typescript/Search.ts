import { getParams } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";

class Search {
    user_info_dom: any;
    songs_dom: any;
    api: any;
    player: any;
    albums_content: any;
    settings: any;
    url_params: any;
    search_string: string;
    search_mode_select: any;
    search_btn: any;
    search_string_dom: any;
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
        this.url_params = conf.url_params;
        this.albums_content = conf.albums_content;
        this.search_mode = "name_song";
        this.search_string = "";
    }
    playMusic = (ev: any) => {
        const song_data = JSON.parse(ev.target.getAttribute("data-info-music"));
        this.player.play(song_data);
    };
    createBackLink() {
        return "<a href='/'>Назад</a>";
    }
    initPlaySongEvents() {
        // вынести
        const plays_btn: any = document.getElementsByClassName("play-btn");
        if (plays_btn) {
            for (var i = 0; i < plays_btn.length; i++) {
                plays_btn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    startSearch = () => {
        const url_search =
            `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&limit=40&search=` +
            this.search_string_dom.value.trim();
        this.albums_content.innerHTML = "<p>Поиск...</p>";
        this.api.getDataFromApi(url_search).then((data: any) => {
            this.albums_content.innerHTML = "";
            const playlist = new PlayList({
                list: data.data,
                title: "Найденные композиции",
                type: "track",
                url: url_search,
            });
            this.albums_content.insertAdjacentHTML("beforeend", playlist.render());
            const plays_btn: any = document.getElementsByClassName("play-btn");
            this.initListenMusicEvent(plays_btn);
        });
    };
    initListenMusicEvent(plays_btn: any) {
        if (plays_btn) {
            for (var i = 0; i < plays_btn.length; i++) {
                plays_btn[i].addEventListener("click", this.playMusic);
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
const audio_player = document.getElementById("audio-player");
const song_info_player = document.getElementById("song-info-player");

const search_string = document.getElementById("search-string");
const search_mode_select = document.getElementById("search-mode");
const search_btn = document.getElementById("search-btn");
const albums_content = document.getElementById("albums-content");

const play_pause = document.getElementById("play-pause");
const play_back = document.getElementById("play-back");
const play_forward = document.getElementById("play-forward");
const play_progress = document.getElementById("play-progress");
const play_sound_mute = document.getElementById("play-sound-mute");
const play_volume = document.getElementById("play-volume");
const play_time_start = document.getElementById("play-time-start");
const play_time_end = document.getElementById("play-time-end");
const play_svg_path = document.getElementById("play_svg_path");
const url_params = getParams(window.location);

const Api_object = new Api();
const player = new AudioPlayer({
    audio_player: audio_player,
    api: Api_object,
    settings: settings,
    song_info_player: song_info_player,
    play_pause: play_pause,
    play_back: play_back,
    play_forward: play_forward,
    play_progress: play_progress,
    play_volume: play_volume,
    play_sound_mute: play_sound_mute,
    time_start: play_time_start,
    time_end: play_time_end,
    play_svg_path: play_svg_path,
});
const main = new Search({
    user_info_dom: user_info_dom,
    songs: songs,
    api: Api_object,
    player: player,
    settings: settings,
    song_info_player: song_info_player,
    url_params: url_params,
    search_string: search_string,
    search_mode_select: search_mode_select,
    search_btn: search_btn,
    albums_content: albums_content,
});
main.init();
