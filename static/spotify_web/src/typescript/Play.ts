import { getParams } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";

import { Api } from "./modules/Api";
import { settings } from "./settings";
import {
    userInfoDom,
    songs,
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
} from "./lib/domInit";

import { ApiInterface } from "./interfaces/ApiInterface";
import { PlayListItemInterface } from "./interfaces/PlayListInterface";
import { SettingsInterface, PlayerInterfaceInput } from "./interfaces/defaultInterface";
import { PlayInterface } from "./interfaces/PlayInterface";
class Play {
    userInfoDom: HTMLElement;
    songsDom: HTMLElement;
    api: ApiInterface;
    player: PlayerInterfaceInput;
    settings: SettingsInterface;
    urlParams: {
        [key: string]: string;
    };
    constructor(conf: PlayInterface) {
        this.userInfoDom = conf.userInfoDom;
        this.songsDom = conf.songs;
        this.api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
        this.urlParams = conf.urlParams;
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
    async prepareArtistSongs() {
        let url_playlist_elem, playlist;
        const urlArtistSongs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&order=track_name_desc&id=${this.urlParams.artist_id}`;
        const artistsSongs = await this.api.getDataFromApi(urlArtistSongs);
        if (artistsSongs.result && artistsSongs.data.length > 0) {
            artistsSongs.data.forEach(
                (element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
                    url_playlist_elem = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${element.id}&order=track_id`;
                    playlist = new PlayList({
                        list: element.tracks,
                        title: element.name,
                        type: "track",
                        url: url_playlist_elem,
                    });
                    this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
                }
            );
        } else {
            this.songsDom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
        }
    }
    async prepareLoverSongs() {
        let url_playlist_elem, playlist;
        const accessToken = localStorage.getItem("accessToken");
        const id_user = localStorage.getItem("id_user");
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&user_id=${id_user}
                &access_token=${accessToken}`;
        const favorite = await this.api.getDataFromApi(url_playlist);
        if (favorite.result) {
            if (favorite.data.length === 0) {
                this.songsDom.insertAdjacentHTML("beforeend", `<h4 style="padding:10px">Список пуст</h4>`);
            }
            favorite.data.forEach((element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
                url_playlist_elem = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${element.id}`;
                playlist = new PlayList({
                    list: element.tracks,
                    title: element.name,
                    type: "track",
                    url: url_playlist_elem,
                });
                this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
            });
        } else {
            this.songsDom.insertAdjacentHTML(
                "beforeend",
                `<h4>Авторизуйтесь, для получения списка ваших плейлистов.</h4>`
            );
        }
    }
    async prepareSongs() {
        if (this.urlParams.playListId) {
            const songs = await this.api.loadPlayList(this.urlParams.playListId, this.settings.CLIENT_ID);
            const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${this.urlParams.playListId}`;
            if (songs.result && songs.data.length > 0) {
                let playlist = new PlayList({
                    list: songs.data[0].tracks,
                    title: songs.data[0].name,
                    type: "track",
                    url: url_playlist,
                });
                this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
            } else {
                this.songsDom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
            }
        }
    }
    setRegistrationLink() {
        const link = document.getElementById("registrationLink");
        link?.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.CLIENT_ID}&redirect_uri=http://localhost:4567/&response_type=code`
        );
    }
    initPlaySongEvents() {
        const playsBtn: HTMLCollection = document.getElementsByClassName("play-btn");
        if (playsBtn) {
            for (var i = 0; i < playsBtn.length; i++) {
                playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    async init() {
        // вход
        this.setRegistrationLink();
        if (this.songsDom) {
            switch (this.urlParams.mode) {
                case "lovesongs":
                    await this.prepareLoverSongs();
                    break;
                case "artist":
                    await this.prepareArtistSongs();
                    break;
                default:
                    await this.prepareSongs();
            }
        }
        this.initPlaySongEvents();
    }
    start() {
        this.init();
    }
}

const urlParams: {
    [key: string]: string;
} = getParams(window.location);

const ApiObject = new Api();
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
const main = new Play({
    userInfoDom: userInfoDom,
    songs: songs,
    api: ApiObject,
    player: player,
    settings: settings,
    urlParams: urlParams,
});
main.start();
