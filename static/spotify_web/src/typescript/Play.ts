import { getParams } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";

import { Api } from "./modules/Api";
import { settings } from "./settings";

class Play {
    user_info_dom: any;
    songs_dom: any;
    api: any;
    player: any;
    settings: any;
    url_params: any;
    constructor(conf: any) {
        this.user_info_dom = conf.user_info_dom;
        this.songs_dom = conf.songs;
        this.api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
        this.url_params = conf.url_params;
    }
    playMusic = (ev: any) => {
        const song_data = JSON.parse(ev.target.getAttribute("data-info-music"));
        this.player.play(song_data);
    };
    createBackLink() {
        return "<a href='/'>Назад</a>";
    }
    async prepareArtistSongs() {
        let url_playlist_elem, playlist;
        const url_artist_songs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&order=track_name_desc&id=${this.url_params.artist_id}`;
        const artists_songs = await this.api.getDataFromApi(url_artist_songs);
        if (artists_songs.result && artists_songs.data.length > 0) {
            artists_songs.data.forEach((element: any) => {
                url_playlist_elem = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&limit=40&id=${element.id}&order=track_id`;
                playlist = new PlayList({
                    list: element.tracks,
                    title: element.name,
                    type: "track",
                    url: url_playlist_elem,
                });
                this.songs_dom.insertAdjacentHTML("beforeend", playlist.render());
            });
        } else {
            this.songs_dom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
        }
    }
    async prepareLoverSongs() {
        let url_playlist_elem, playlist;
        const access_token = localStorage.getItem("access_token");
        const id_user = localStorage.getItem("id_user");
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&user_id=${id_user}
                &access_token=${access_token}`;
        const favorite = await this.api.getDataFromApi(url_playlist);
        if (favorite.result) {
            if (favorite.data.length == 0) {
                this.songs_dom.insertAdjacentHTML("beforeend", `<h4 style="padding:10px">Список пуст</h4>`);
            }
            favorite.data.forEach((element: any) => {
                url_playlist_elem = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&limit=40&id=${element.id}`;
                playlist = new PlayList({
                    list: element.tracks,
                    title: element.name,
                    type: "track",
                    url: url_playlist_elem,
                });
                this.songs_dom.insertAdjacentHTML("beforeend", playlist.render());
            });
        } else {
            alert(favorite.message.headers.error_message);
            this.songs_dom.insertAdjacentHTML(
                "beforeend",
                `<h4>Авторизуйтесь, для получения списка ваших плейлистов.</h4>`
            );
        }
    }
    async prepareSongs() {
        const songs = await this.api.loadPlayList(this.url_params.play_list_id, this.settings.client_id);
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&limit=40&id=${this.url_params.play_list_id}`;
        if (songs.result && songs.data.length > 0) {
            let playlist = new PlayList({
                list: songs.data[0].tracks,
                title: songs.data[0].name,
                type: "track",
                url: url_playlist,
            });
            this.songs_dom.insertAdjacentHTML("beforeend", playlist.render());
        } else {
            this.songs_dom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
        }
    }
    setRegistrationLink() {
        const link = document.getElementById("registration__link");
        link?.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.client_id}&redirect_uri=http://localhost:4567/&response_type=code`
        );
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
    async init() {
        // вход
        this.setRegistrationLink();
        if (this.songs_dom) {
            if (this.url_params.mode === "lovesongs") {
                await this.prepareLoverSongs();
            } else {
                if (this.url_params.mode === "artist") {
                    await this.prepareArtistSongs();
                } else {
                    await this.prepareSongs();
                }
            }
        }
        this.initPlaySongEvents();
    }
    async start() {
        this.init();
    }
}

const user_info_dom = document.getElementById("user-info");
const songs = document.getElementById("songs");
const audio_player = document.getElementById("audio-player");
const song_info_player = document.getElementById("song-info-player");

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
const main = new Play({
    user_info_dom: user_info_dom,
    songs: songs,
    api: Api_object,
    player: player,
    settings: settings,
    song_info_player: song_info_player,
    url_params: url_params,
});
main.start();
