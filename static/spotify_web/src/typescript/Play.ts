import { getParams } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";

import { Api } from "./modules/Api";
import { settings } from "./settings";

class Play {
    user_info_dom: HTMLElement | null;
    songs_dom: HTMLElement | null;
    api: any;
    player: any;
    settings: any;
    urlParams: any;
    constructor(conf: any) {
        this.user_info_dom = conf.user_info_dom;
        this.songs_dom = conf.songs;
        this.api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
        this.urlParams = conf.urlParams;
    }
    playMusic = (ev: any) => {
        const songData = JSON.parse(ev.target.getAttribute("data-info-music"));
        this.player.play(songData);
    };
    createBackLink() {
        return "<a href='/'>Назад</a>";
    }
    async prepareArtistSongs() {
        let url_playlist_elem, playlist;
        const urlArtist_songs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&order=track_name_desc&id=${this.urlParams.artist_id}`;
        const artists_songs = await this.api.getDataFromApi(urlArtist_songs);
        if (artists_songs.result && artists_songs.data.length > 0) {
            artists_songs.data.forEach((element: any) => {
                url_playlist_elem = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&limit=40&id=${element.id}&order=track_id`;
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
        const accessToken = localStorage.getItem("accessToken");
        const id_user = localStorage.getItem("id_user");
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&user_id=${id_user}
                &accessToken=${accessToken}`;
        const favorite = await this.api.getDataFromApi(url_playlist);
        if (favorite.result) {
            if (favorite.data.length == 0) {
                this.songs_dom.insertAdjacentHTML("beforeend", `<h4 style="padding:10px">Список пуст</h4>`);
            }
            favorite.data.forEach((element: any) => {
                url_playlist_elem = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&limit=40&id=${element.id}`;
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
        const songs = await this.api.loadPlayList(this.urlParams.playListId, this.settings.clientId);
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&limit=40&id=${this.urlParams.playListId}`;
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
        const link = document.getElementById("registrationLink");
        link?.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.clientId}&redirect_uri=http://localhost:4567/&response_type=code`
        );
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
    async init() {
        // вход
        this.setRegistrationLink();
        if (this.songs_dom) {
            if (this.urlParams.mode === "lovesongs") {
                await this.prepareLoverSongs();
            } else {
                if (this.urlParams.mode === "artist") {
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
const audioPlayer = document.getElementById("audio-player");
const songInfoPlayer = document.getElementById("song-info-player");

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
const main = new Play({
    user_info_dom: user_info_dom,
    songs: songs,
    api: Api_object,
    player: player,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    urlParams: urlParams,
});
main.start();
