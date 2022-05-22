import { postJSON, getParams, getCurentUserInfo, getDataFromApi } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";

import {
    userInfoDom,
    playsBtn,
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
    registrationLink,
} from "./lib/domInit";

import {
    SettingsInterface,
    GetUserInfoInterface,
    PlayerInterfaceInput,
    DefaultRequest,
} from "./interfaces/defaultInterface";
import { MainPageInterface } from "./interfaces/MainPageInterface";
let tokenInfo: { accessToken: string } = { accessToken: "" };

function getTemplateForUserInfo(userInfo: { image: string; dispname: string }) {
    return `
        <div class="user-info">
            <img src="${userInfo.image}"alt="image_profile">
            <span>${userInfo.dispname}</span>
        </div>
    `;
}

class MainPage {
    userInfoDom: HTMLElement;
    albumsContent: HTMLElement;

    player: PlayerInterfaceInput;

    registrationLink: HTMLElement;
    settings: SettingsInterface;
    playsBtn: HTMLCollection;
    constructor(conf: MainPageInterface) {
        this.userInfoDom = conf.userInfoDom;
        this.albumsContent = conf.albumsContent;
        this.registrationLink = conf.registrationLink;

        this.player = conf.player;
        this.settings = conf.settings;
        this.playsBtn = conf.playsBtn;
    }

    playMusic = (ev: Event) => {
        ev.preventDefault();
        if (ev.target) {
            const el = ev.target as HTMLInputElement;
            const songSetting = el.getAttribute("data-info-music");
            if (songSetting) {
                const songData = JSON.parse(songSetting);
                if (this.player.play) this.player.play(songData);
            }
        }
    };
    async init() {
        // вход

        this.registrationLink.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.CLIENT_ID}&redirect_uri=http://localhost:4567/&response_type=code`
        );
        if (this.albumsContent) {
            // fuzzytags - выбор по тегам
            let url, playlist;

            // новинки
            url = `https://api.jamendo.com/v3.0/playlists/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=12&datebetween=2022-01-02_2022-04-01&hasimage=1`;
            const albums: DefaultRequest = await getDataFromApi(url);
            if (albums.result) {
                playlist = new PlayList({ list: albums.data, title: "Плейлисты", type: "playlist", url: url });
                this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
            }

            /// afhnbcns
            const urlArtist = `https://api.jamendo.com/v3.0/artists/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=12&imagesize=100`;
            const albumsArtist: DefaultRequest = await getDataFromApi(urlArtist);

            playlist = new PlayList({
                list: albumsArtist.data,
                title: "Исполнители",
                type: "artist",
                url: urlArtist,
            });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
            // по жанрам
            // артисты
            const urlTop = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=12&include=musicinfo&boost=listens_week&imagesize=100`;
            const trackTop: DefaultRequest = await getDataFromApi(urlTop);

            playlist = new PlayList({ list: trackTop.data, title: "Новинки недели", type: "track", url: urlTop });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());

            const urlJenre = `https://api.jamendo.com/v3.0/playlists/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=12`;
            const albumsJenre: DefaultRequest = await getDataFromApi(urlJenre);
            playlist = new PlayList({ list: albumsJenre.data, title: "Жанры", type: "playlist", url: urlJenre });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
        }

        if (this.playsBtn) {
            for (var i = 0; i < this.playsBtn.length; i++) {
                playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    start() {
        this.init();
    }
}
const urlParams = getParams(window.location);

if (urlParams.code && !tokenInfo.accessToken && !localStorage.getItem("accessToken")) {
    postJSON("/", {
        code: urlParams.code,
    }).then(async (answer) => {
        const parsedToken = JSON.parse(answer.accessToken);
        if (parsedToken.error) {
            alert("ERROR =>" + parsedToken.error_description);
        } else {
            registrationLink.style.display = "none";
            localStorage.setItem("accessToken", parsedToken.access_token);
            localStorage.setItem("timeSetAccessToken", new Date().getTime().toString());
            tokenInfo = parsedToken.access_token;
            const userInfo: GetUserInfoInterface = await getCurentUserInfo(parsedToken.access_token);

            if (userInfoDom && userInfo.result) {
                localStorage.setItem("id_user", userInfo.user.id);
                const userInfoContent = getTemplateForUserInfo(userInfo.user);
                userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
            } else {
                alert(userInfo.message);
            }
        }
    });
} else {
    if (localStorage.getItem("accessToken") !== "undefined") {
        const timeSetAccessToken = Number(localStorage.getItem("timeSetAccessToken"));
        const dateSetToken: Date = new Date(timeSetAccessToken);
        const curentDate: Date = new Date();
        if (curentDate.getTime() - dateSetToken.getTime() > 5000000) {
            localStorage.removeItem("timeSetAccessToken");
            localStorage.removeItem("accessToken");
        } else {
            const tokenFromStorage = localStorage.getItem("accessToken");
            if (tokenFromStorage) {
                tokenInfo = { accessToken: tokenFromStorage };
                getCurentUserInfo(tokenInfo.accessToken).then((userInfo: GetUserInfoInterface) => {
                    if (userInfo.result) {
                        localStorage.setItem("id_user", userInfo.user.id);
                        registrationLink.style.display = "none";
                        if (userInfoDom) {
                            const userInfoContent = getTemplateForUserInfo(userInfo.user);
                            userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
                        } else {
                            alert("Error: " + userInfo.message);
                        }
                    } else {
                        alert(userInfo.message);
                    }
                });
            }
        }
    }
}

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
const main = new MainPage({
    userInfoDom: userInfoDom,
    albumsContent: albumsContent,

    player: player,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    registrationLink: registrationLink,
    playsBtn: playsBtn,
});
main.start();
