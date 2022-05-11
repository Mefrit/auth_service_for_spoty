import { postJSON, getParams, getJSON } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";
// const settings = {
//     // _client_id: "cf25482b",
//     _client_id: "cf25482b",
//     _api_key: "4797f3a80bd19061a2d6e4ffc7f89856b040a81a",
//     _secret: "6b8f1bb64f106a4f520b3bf98717e06e",
//     _api_base: "https://api.jamendo.com/v3.0/",
//     _code: "4fc6741c3be9f6fb9c13c9be0e8c2f9889e98396",
// };
// let access_token: any = null;

let token_info: any = {};

async function getCurentUserInfo(access_token: string) {
    return new Promise((resolve, reject) => {
        const url =
            "https://api.jamendo.com/v3.0/users/?client_id=cf25482b&format=jsonpretty&access_token=" + access_token;
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
const url_params = getParams(window.location);

function getTemplateForUserInfo(user_info: any) {
    return `
        <div class="user-info">
            <img src="${user_info.image}"alt="image_profile">
            <span>${user_info.dispname}</span>
        </div>
    `;
}
class MainPage {
    user_info_dom: any;
    albums_content: any;
    api: any;
    player: any;
    registration__link: any;
    settings: any;
    constructor(conf: any) {
        this.user_info_dom = conf.user_info_dom;
        this.albums_content = conf.albums_content;
        this.registration__link = conf.registration__link;
        this.api = conf.api;
        this.player = conf.player;
        this.settings = conf.settings;
    }
    playMusic = (ev: any) => {
        ev.preventDefault();

        const song_data = JSON.parse(ev.target.getAttribute("data-info-music"));
        this.player.play(song_data);
    };
    async init() {
        // вход

        this.registration__link.setAttribute(
            "href",
            `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.client_id}&redirect_uri=http://localhost:4567/&response_type=code`
        );
        if (this.albums_content) {
            // fuzzytags - выбор по тегам
            let url, playlist;

            // новинки
            url = `https://api.jamendo.com/v3.0/playlists/?client_id=${this.settings.client_id}&format=jsonpretty&limit=12&datebetween=2022-01-02_2022-04-01&hasimage=1`;
            const albums: any = await getDataFromApi(url);
            // console.log("albums", albums);
            playlist = new PlayList({ list: albums.data, title: "Плейлисты", type: "playlist", url: url });
            this.albums_content.insertAdjacentHTML("beforeend", playlist.render());

            /// afhnbcns
            const url_artist = `https://api.jamendo.com/v3.0/artists/?client_id=${this.settings.client_id}&format=jsonpretty&limit=12&imagesize=100`;
            const albums_artist: any = await getDataFromApi(url_artist);

            playlist = new PlayList({
                list: albums_artist.data,
                title: "Исполнители",
                type: "artist",
                url: url_artist,
            });
            this.albums_content.insertAdjacentHTML("beforeend", playlist.render());
            // по жанрам
            const url_jenre = `https://api.jamendo.com/v3.0/playlists/?client_id=${this.settings.client_id}&format=jsonpretty&limit=12`;
            const albums_jenre: any = await getDataFromApi(url_jenre);

            playlist = new PlayList({ list: albums_jenre.data, title: "Жанры", type: "playlist", url: url_jenre });
            this.albums_content.insertAdjacentHTML("beforeend", playlist.render());
            // артисты

            const url_top = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.client_id}&format=jsonpretty&limit=12&include=musicinfo&boost=listens_week&imagesize=100`;
            const track_top: any = await getDataFromApi(url_top);

            playlist = new PlayList({ list: track_top.data, title: "Новинки недели", type: "track", url: url_top });
            this.albums_content.insertAdjacentHTML("beforeend", playlist.render());
            // топ треков
            // url = `https://api.jamendo.com/v3.0/albums/?client_id=${this.settings.client_id}&format=jsonpretty&limit=12&order=popularity_total&datebetween=2021-01-02_2022-05-01&lang=en&hasscore=2&access_token=${token_info.access_token}`;
            // const popularity_total: any = await getDataFromApi(url);

            // if (popularity_total.result) {
            //     playlist = new PlayList({
            //         list: popularity_total.data,
            //         title: "Популярное",
            //         type: "album",
            //         url: url,
            //     });
            //     this.albums_content.insertAdjacentHTML("beforeend", playlist.render());
            // }
        }

        const plays_btn: any = document.getElementsByClassName("play-btn");
        if (plays_btn) {
            for (var i = 0; i < plays_btn.length; i++) {
                plays_btn[i].addEventListener("click", this.playMusic);
            }
        }
    }
    async start() {
        this.init();
    }
}

const user_info_dom = document.getElementById("user-info");
const albums_content = document.getElementById("albums-content");
const audio_player = document.getElementById("audio-player");
const song_info_player = document.getElementById("song-info-player");

const play_pause = document.getElementById("play-pause");
const play_back = document.getElementById("play-back");
const play_forward = document.getElementById("play-forward");
const play_progress = document.getElementById("play-progress");
const play_sound_mute = document.getElementById("play-sound-mute");
const play_volume = document.getElementById("play-volume");
const time_start = document.getElementById("play-time-start");
const time_end = document.getElementById("play-time-end");
const play_svg_path = document.getElementById("play_svg_path");
const registration__link: any = document.getElementById("registration__link");
if (url_params.code && !token_info.access_token && !localStorage.getItem("access_token")) {
    // https://pixel-space.herokuapp.com/?module=registration&action=Enter

    postJSON("/", {
        code: url_params.code,
    }).then(async (answer: any) => {
        token_info = JSON.parse(answer.access_token);

        if (token_info.error) {
            alert("ERROR =>" + token_info.error_description);
        } else {
            registration__link.style.display = "none";
            localStorage.setItem("access_token", token_info.access_token);
            localStorage.setItem("time_set_access_token", new Date().getTime().toString());
            const user_info: any = await getCurentUserInfo(token_info.access_token);

            if (user_info_dom && user_info.result) {
                localStorage.setItem("id_user", user_info.user.id);
                const user_info_content = getTemplateForUserInfo(user_info.user);
                user_info_dom.insertAdjacentHTML("beforeend", user_info_content);
            }
        }
    });
} else {
    if (localStorage.getItem("access_token")) {
        const time_set_access_token = Number(localStorage.getItem("time_set_access_token"));
        const date_set_token: any = new Date(time_set_access_token);
        const curent_date: any = new Date();
        if (curent_date - date_set_token > 5000000) {
            localStorage.removeItem("time_set_access_token");
            localStorage.removeItem("access_token");
        } else {
            token_info = { access_token: localStorage.getItem("access_token") };
            getCurentUserInfo(token_info.access_token).then((user_info: any) => {
                localStorage.setItem("id_user", user_info.user.id);
                registration__link.style.display = "none";
                if (user_info_dom) {
                    const user_info_content = getTemplateForUserInfo(user_info.user);
                    user_info_dom.insertAdjacentHTML("beforeend", user_info_content);
                }
            });
        }
    }
}

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
    time_start: time_start,
    time_end: time_end,
    play_svg_path: play_svg_path,
});
const main = new MainPage({
    user_info_dom: user_info_dom,
    albums_content: albums_content,
    api: Api_object,
    player: player,
    settings: settings,
    song_info_player: song_info_player,
    registration__link: registration__link,
});
main.start();
