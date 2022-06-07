// import { PlayList } from "./modules/PlayList";
// import { AudioPlayer } from "./modules/AudioPlayer";
// import { Api } from "./modules/Api";
// import { settings } from "./settings";
// import { setUserInfoFromStorage } from "./lib/reqistration";
// import {
//     userInfoDom,
//     searchBtn,
//     albumsContent,
//     audioPlayer,
//     songInfoPlayer,
//     playPause,
//     playBack,
//     playForward,
//     playProgress,
//     playSoundMute,
//     playVolume,
//     playTimeStart,
//     playSvgPath,
//     playTimeEnd,
//     songs,
//     playsBtn,
//     searchStringDom,
//     registrationLink,
// } from "./lib/domInit";
// import { SettingsInterface, PlayerInterfaceInput, DefaultRequest } from "./interfaces/DefaultInterface";
// import { SearchInterface } from "./interfaces/SearchInterface";
// import { ApiInterface } from "./interfaces/ApiInterface";

// className Search {
//     userInfoDom: HTMLElement;
//     songsDom: HTMLElement;
//     Api: ApiInterface;
//     player: PlayerInterfaceInput;
//     albumsContent: HTMLElement;
//     settings: SettingsInterface;
//     search_string: string;
//     searchBtn: HTMLElement;
//     searchStringDom: HTMLElement;
//     playsBtn: HTMLCollection;
//     search_mode: string;
//     constructor(conf: SearchInterface) {
//         this.userInfoDom = conf.userInfoDom;
//         this.songsDom = conf.songs;
//         this.searchStringDom = conf.searchStringDom;
//         this.searchBtn = conf.searchBtn;

//         this.Api = conf.api;
//         this.player = conf.player;
//         this.settings = conf.settings;
//         this.playsBtn = conf.playsBtn;
//         this.albumsContent = conf.albumsContent;
//         this.search_mode = "name_song";
//         this.search_string = "";
//     }
//     playMusic = (ev: Event) => {
//         if (ev.target) {
//             const el = ev.target as HTMLInputElement;
//             const songSetting = el.getAttribute("data-info-music");
//             if (songSetting) {
//                 const songData = JSON.parse(songSetting);
//                 this.player.play(songData);
//             }
//         }
//     };
//     createBackLink() {
//         return "<a href='/'>Назад</a>";
//     }
//     initPlaySongEvents() {
//         // вынести

//         if (this.playsBtn) {
//             for (var i = 0; i < this.playsBtn.length; i++) {
//                 this.playsBtn[i].addEventListener("click", this.playMusic);
//             }
//         }
//     }
//     startSearch = () => {
//         const value = (this.searchStringDom as HTMLInputElement).value;
//         const url_search =
//             `https://api.jamendo.com/v3.0/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&search=` +
//             value.trim();
//         this.albumsContent.innerHTML = "<p>Поиск...</p>";
//         this.Api.getDataFromApi(url_search).then((data: DefaultRequest) => {
//             this.albumsContent.innerHTML = "";
//             const playlist = new PlayList({
//                 list: data.data,
//                 title: "Найденные композиции",
//                 type: "track",
//                 url: url_search,
//             });
//             this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
//             const playsBtn = document.getElementsByclassNameName("play-btn");
//             this.initListenMusicEvent(playsBtn);
//         });
//     };
//     initListenMusicEvent(playsBtn: HTMLCollection) {
//         if (playsBtn) {
//             for (var i = 0; i < playsBtn.length; i++) {
//                 playsBtn[i].addEventListener("click", this.playMusic);
//             }
//         }
//     }
//     initSearchEvents() {
//         this.searchBtn.addEventListener("click", this.startSearch);
//         this.searchStringDom.addEventListener("keydown", (event) => {
//             if (event.keyCode == 13) {
//                 event.preventDefault();
//                 this.startSearch();
//             }
//         });
//     }
//     setRegistrationLink() {
//         registrationLink?.setAttribute(
//             "href",
//             `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.CLIENT_ID}&redirect_uri=http://localhost:4567/&response_type=code`
//         );
//     }
//     async init() {
//         // вход

//         this.setRegistrationLink();
//         if (localStorage.getItem("accessToken") !== "undefined") {
//             setUserInfoFromStorage(userInfoDom, registrationLink);
//         }
//         this.initSearchEvents();
//     }
//     start() {
//         this.init();
//     }
// }

// const ApiObject: ApiInterface = new Api();

// const player = new AudioPlayer({
//     audioPlayer: audioPlayer,
//     api: ApiObject,
//     settings: settings,
//     songInfoPlayer: songInfoPlayer,
//     playPause: playPause,
//     playBack: playBack,
//     playForward: playForward,
//     playProgress: playProgress,
//     playVolume: playVolume,
//     playSoundMute: playSoundMute,
//     timeStart: playTimeStart,
//     timeEnd: playTimeEnd,
//     playSvgPath: playSvgPath,
// });

// const main = new Search({
//     userInfoDom: userInfoDom,
//     songs: songs,
//     api: ApiObject,
//     player: player,
//     settings: settings,
//     songInfoPlayer: songInfoPlayer,
//     searchStringDom: searchStringDom,
//     searchBtn: searchBtn,
//     albumsContent: albumsContent,
//     playsBtn: playsBtn,
// });
// main.init();\
import { PlayList } from "./modules/PlayList"
import { AudioPlayer } from "./modules/AudioPlayer"
import { postJSON, getParams, getCurentUserInfo, getDataFromApi } from "./lib/query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import { settings } from "./settings";
import { Auth } from "./modules/auth"
import React, { useEffect, useState, useRef } from "react"
import { render } from "@testing-library/react";
export function Search(props: any) {
    const [searchparams, setSearchParams] = useState("Linkin Park");
    const [tracklist, setTrackLists] = useState([]);
    const [load, setLoad] = useState(false);

    const [index, setIndex] = useState(0);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [url, setUrl] = useState("");
    const [nameSong, setNameSong] = useState("");
    const [author, setAuthor] = useState("");
    const [albumImage, setAlbumImage] = useState("#");
    const [audioUrl, setAudioUrl] = useState("#");
    console.log(props)
    useEffect(() => { }, [tracklist, load, searchparams])
    const startSearch = () => {
        if (searchparams.length > 0) {
            const url_search =
                `https://api.jamendo.com/v3.0/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=30&search=` +
                searchparams.trim();
            setLoad(true)
            getDataFromApi(url_search).then((answer: any) => {
                console.log('data', answer);
                setLoad(false)
                if (answer.result) {
                    setTrackLists(answer.data)
                }

                // this.albumsContent.innerHTML = "";
                // const playlist = new PlayList({
                //     list: data.data,
                //     title: "Найденные композиции",
                //     type: "track",
                //     url: url_search,
                // });
                // this.albumsContent.insertAdjacentHTML("beforeend", playlist.render());
                // const playsBtn = document.getElementsByclassNameName("play-btn");
                // this.initListenMusicEvent(playsBtn);
            });
        }

    };
    const setSong = (data: any) => {
        console.log("setSong===> ", data);
        setAudioUrl(data.audio);
        setNameSong(data.name);
        setAlbumImage(data.album_image);
        setAuthor(data.album_name)
    }
    function renderTrack(list: any) {
        if (list.length === 0) {
            return "Введите параметры поиска"
        }
        return <PlayList setSong={setSong} list={list} title={searchparams} type={"track"} url={""} />
        // return list.map(elem => {
        //     return elem.name
        // })
    }
    //вынести 
    function getIndexByIdInPlayList(list, id) {
        let findIndex = 0;
        list.forEach((elem: any, index: number, arr: any) => {
            if (elem.id === id) {
                findIndex = index;
            }
        })
        return findIndex;
    }
    const changeSong = (index: any) => {
        console.log("index===... ", index);

        setAudioUrl(tracklist[index].audio);
        setNameSong(tracklist[index].name);
        setAlbumImage(tracklist[index].album_image);
        setAuthor(tracklist[index].album_name)

    }
    return <div className="content content-search ">
        <Auth clientId={props.init.settings.CLIENT_ID} timeBlock={props.init.settings.TIME_TO_BLOCK} />
        <div className="search">
            <div className="search__text-interface">
                <label >Название песни, автора или жанр

                    <input type="text" id="search-string" onChange={(ev) => { setSearchParams(ev.target.value) }} defaultValue="Linkin Park" className="search__string" placeholder="Введите запрос" />
                </label>
            </div>

            <input type="button" className="search__action" id="search-btn" onClick={() => { startSearch() }} value="Найти" />
        </div>
        {load ? <div className="search_content">Загрузка...</div> : <div id="albums-content" className="search_content">{renderTrack(tracklist)}</div>}


        <AudioPlayer author={author} audioUrl={audioUrl} length={tracklist.length} albumImage={albumImage} nameSong={nameSong} changeSong={changeSong} />
    </div>
}
console.log("SEARCHG===>>> ")
const config = {

    settings: settings
}
const root = ReactDOM.createRoot(document.getElementById("rootsearch"));
// console.log("MAIN111111111111");
root.render(
    <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<MainPage init={config} />} /> */}
            <Route path="/search" element={<Search init={config} />} />
        </Routes>
    </BrowserRouter>
);
