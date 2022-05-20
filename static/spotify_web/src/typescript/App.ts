import { postJSON, getParams, getJSON } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";

let tokenInfo: any = {};

async function getCurentUserInfo(accessToken: string) {
    return new Promise((resolve, reject) => {
        const url =
            "https://api.jamendo.com/v3.0/users/?client_id=cf25482b&format=jsonpretty&accessToken=" + accessToken;
        getJSON(url).then((data: any) => {
            if (data.headers.status === "success") {
                resolve({ result: true, user: data.results[0] });
            } else {
                resolve({ result: false, message: data });
            }
        });
    });
}
function getDataFromApi(url: string) {
    return new Promise((resolve, reject) => {
        getJSON(url).then((data: any) => {
            if (data.headers.status === "success") {
                resolve({ result: true, data: data.results });
            } else {
                resolve({ result: false, message: data });
            }
        });
    });
}

function getTemplateForUserInfo(userInfo: any) {
    return `
        <div class="user-info">
            <img src="${userInfo.image}"alt="image_profile">
            <span>${userInfo.dispname}</span>
        </div>
    `;
}
class MainPage {
    userInfoDom: any;
    albumsContent: any;
    api: any;
    player: any;
    registrationLink: any;
    settings: any;
    playsBtn: any;
    constructor(conf: any) {
        this.userInfoDom = conf.userInfoDom;
        this.albumsContent = conf.albumsContent;
        this.registrationLink = conf.registrationLink;
        this.api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
        this.playsBtn = conf.playsBtn;
    }
    playMusic = (ev: any) => {
        ev.preventDefault();

        const songData = JSON.parse(ev.target.getAttribute("data-info-music"));
        this.player.play(songData);
    };
    async init() {
        // вход

        this.registrationLink.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.clientId}&redirect_uri=http://localhost:4567/&response_type=code`
        );
        if (this.albumsContent) {
            // fuzzytags - выбор по тегам
            let url, playlist;

            // новинки
            url = `https://api.jamendo.com/v3.0/playlists/?client_id=${this.settings.clientId}&format=jsonpretty&limit=12&datebetween=2022-01-02_2022-04-01&hasimage=1`;
            const albums: any = await getDataFromApi(url);

            playlist = new PlayList({ list: albums.data, title: "Плейлисты", type: "playlist", url: url });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());

            /// afhnbcns
            const urlArtist = `https://api.jamendo.com/v3.0/artists/?client_id=${this.settings.clientId}&format=jsonpretty&limit=12&imagesize=100`;
            const albumsArtist: any = await getDataFromApi(urlArtist);

            playlist = new PlayList({
                list: albumsArtist.data,
                title: "Исполнители",
                type: "artist",
                url: urlArtist,
            });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
            // по жанрам

            // артисты
            const urlTop = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.clientId}&format=jsonpretty&limit=12&include=musicinfo&boost=listens_week&imagesize=100`;
            const trackTop: any = await getDataFromApi(urlTop);

            playlist = new PlayList({ list: trackTop.data, title: "Новинки недели", type: "track", url: urlTop });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());

            const urlJenre = `https://api.jamendo.com/v3.0/playlists/?client_id=${this.settings.clientId}&format=jsonpretty&limit=12`;
            const albumsJenre: any = await getDataFromApi(urlJenre);
            playlist = new PlayList({ list: albumsJenre.data, title: "Жанры", type: "playlist", url: urlJenre });
            this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
        }

        const playsBtn: any = document.getElementsByClassName("play-btn");
        if (playsBtn) {
            for (var i = 0; i < playsBtn.length; i++) {
                playsBtn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    start() {
        this.init();
    }
}
const urlParams = getParams(window.location);

const playsBtn: any = document.getElementsByClassName("play-btn");
const userInfoDom = document.getElementById("user-info");
const albumsContent = document.getElementById("albums-content");
const audioPlayer = document.getElementById("audio-player");
const songInfoPlayer = document.getElementById("song-info-player");

const playPause = document.getElementById("play-pause");
const playBack = document.getElementById("play-back");
const playForward = document.getElementById("play-forward");
const playProgress = document.getElementById("play-progress");
const playSoundMute = document.getElementById("play-sound-mute");
const playVolume = document.getElementById("play-volume");
const timeStart = document.getElementById("play-time-start");
const timeEnd = document.getElementById("play-time-end");
const playSvgPath = document.getElementById("playSvgPath");
const registrationLink: any = document.getElementById("registrationLink");

if (urlParams.code && !tokenInfo.accessToken && !localStorage.getItem("accessToken")) {
    postJSON("/", {
        code: urlParams.code,
    }).then(async (answer: any) => {
        tokenInfo = JSON.parse(answer.accessToken);
        console.log("tokenInfo", tokenInfo);
        if (tokenInfo.error) {
            alert("ERROR =>" + tokenInfo.error_description);
        } else {
            registrationLink.style.display = "none";
            localStorage.setItem("accessToken", tokenInfo.accessToken);
            localStorage.setItem("timeSetAccessToken", new Date().getTime().toString());
            const userInfo: any = await getCurentUserInfo(tokenInfo.accessToken);

            if (userInfoDom && userInfo.result) {
                localStorage.setItem("id_user", userInfo.user.id);
                const userInfoContent = getTemplateForUserInfo(userInfo.user);
                userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
            }
        }
    });
} else {
    if (localStorage.getItem("accessToken")) {
        const timeSetAccessToken = Number(localStorage.getItem("timeSetAccessToken"));
        const dateSetToken: any = new Date(timeSetAccessToken);
        const curentDate: any = new Date();
        if (curentDate - dateSetToken > 5000000) {
            localStorage.removeItem("timeSetAccessToken");
            localStorage.removeItem("accessToken");
        } else {
            tokenInfo = { accessToken: localStorage.getItem("accessToken") };
            getCurentUserInfo(tokenInfo.accessToken).then((userInfo: any) => {
                localStorage.setItem("id_user", userInfo.user.id);
                registrationLink.style.display = "none";
                if (userInfoDom) {
                    const userInfoContent = getTemplateForUserInfo(userInfo.user);
                    userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
                }
            });
        }
    }
}

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
    timeStart: timeStart,
    timeEnd: timeEnd,
    playSvgPath: playSvgPath,
});
const main = new MainPage({
    userInfoDom: userInfoDom,
    albumsContent: albumsContent,
    api: Api_object,
    player: player,
    settings: settings,
    songInfoPlayer: songInfoPlayer,
    registrationLink: registrationLink,
    playsBtn: playsBtn,
});
main.start();
