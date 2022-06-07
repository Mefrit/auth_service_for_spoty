import { getParams } from "../lib/query";
import { PlayList } from "../modules/PlayList";

import { setUserInfoFromStorage } from "../lib/reqistration";
import { Api } from "../modules/Api";
import { settings } from "../settings";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import { useSearchParams } from "react-router-dom";
import { MainPage } from "../App"
import { postJSON, getCurentUserInfo, getDataFromApi } from "../lib/query";
import { Auth } from "../modules/auth"
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
    registrationLink,
} from "../lib/domInit";

import { ApiInterface } from "../interfaces/ApiInterface";
import { PlayListItemInterface } from "../interfaces/PlayListInterface";
import { SettingsInterface, PlayerInterfaceInput } from "../interfaces/DefaultInterface";
import { PlayInterface } from "../interfaces/PlayInterface";
import { AudioPlayer } from "./AudioPlayer"
// class Play1 {
//     userInfoDom: HTMLElement;
//     songsDom: HTMLElement;
//     api: ApiInterface;
//     player: PlayerInterfaceInput;
//     settings: SettingsInterface;
//     urlParams: {
//         [key: string]: string;
//     };
//     constructor(conf: PlayInterface) {
//         this.userInfoDom = conf.userInfoDom;
//         this.songsDom = conf.songs;
//         this.api = conf.api;
//         this.player = conf.player;
//         this.settings = conf.settings;
//         this.urlParams = conf.urlParams;
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
//     async prepareArtistSongs() {
//         let url_playlist_elem, playlist;
//         const urlArtistSongs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&order=track_name_desc&id=${this.urlParams.artist_id}`;
//         const artistsSongs = await this.api.getDataFromApi(urlArtistSongs);
//         if (artistsSongs.result && artistsSongs.data.length > 0) {
//             artistsSongs.data.forEach(
//                 (element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
//                     url_playlist_elem = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${element.id}&order=track_id`;
//                     playlist = new PlayList({
//                         list: element.tracks,
//                         title: element.name,
//                         type: "track",
//                         url: url_playlist_elem,
//                     });
//                     this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
//                 }
//             );
//         } else {
//             this.songsDom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
//         }
//     }
//     async prepareLoverSongs() {
//         let url_playlist_elem, playlist;
//         const accessToken = localStorage.getItem("accessToken");
//         const id_user = localStorage.getItem("id_user");
//         const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&user_id=${id_user}
//                 &access_token=${accessToken}`;
//         const favorite = await this.api.getDataFromApi(url_playlist);
//         if (favorite.result) {
//             if (favorite.data.length === 0) {
//                 this.songsDom.insertAdjacentHTML("beforeend", `<h4 style="padding:10px">Список пуст</h4>`);
//             }
//             favorite.data.forEach((element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
//                 url_playlist_elem = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${element.id}`;
//                 playlist = new PlayList({
//                     list: element.tracks,
//                     title: element.name,
//                     type: "track",
//                     url: url_playlist_elem,
//                 });
//                 this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
//             });
//         } else {
//             this.songsDom.insertAdjacentHTML(
//                 "beforeend",
//                 `<h4>Авторизуйтесь, для получения списка ваших плейлистов.</h4>`
//             );
//         }
//     }
//     async prepareSongs() {
//         if (this.urlParams.playListId) {
//             const songs: unknown = await this.api.loadPlayList(this.urlParams.playListId, this.settings.CLIENT_ID);
//             const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${this.urlParams.playListId}`;
//             if (songs.result && songs.data.length > 0) {
//                 let playlist = new PlayList({
//                     list: songs.data[0].tracks,
//                     title: songs.data[0].name,
//                     type: "track",
//                     url: url_playlist,
//                 });
//                 this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
//             } else {
//                 this.songsDom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
//             }
//         }
//     }
//     setRegistrationLink() {
//         registrationLink?.setAttribute(
//             "href",
//             `https://api.jamendo.com/v3.0/oauth/authorize?client_id=${this.settings.CLIENT_ID}&redirect_uri=http://localhost:4567/&response_type=code`
//         );
//     }
//     initPlaySongEvents() {
//         const playsBtn: HTMLCollection = document.getElementsByClassName("play-btn");
//         if (playsBtn) {
//             for (var i = 0; i < playsBtn.length; i++) {
//                 playsBtn[i].addEventListener("click", this.playMusic);
//             }
//         }
//     }
//     async init() {
//         // вход
//         this.setRegistrationLink();
//         if (localStorage.getItem("accessToken") !== "undefined") {
//             setUserInfoFromStorage(userInfoDom, registrationLink);
//         }
//         if (this.songsDom) {
//             switch (this.urlParams.mode) {
//                 case "lovesongs":
//                     await this.prepareLoverSongs();
//                     break;
//                 case "artist":
//                     await this.prepareArtistSongs();
//                     break;
//                 default:
//                     await this.prepareSongs();
//             }
//         }
//         this.initPlaySongEvents();
//     }
//     start() {
//         this.init();
//     }
// }
//     async prepareArtistSongs() {
//         let url_playlist_elem, playlist;
//         const urlArtistSongs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&order=track_name_desc&id=${this.urlParams.artist_id}`;
//         const artistsSongs = await this.api.getDataFromApi(urlArtistSongs);
//         if (artistsSongs.result && artistsSongs.data.length > 0) {
//             artistsSongs.data.forEach(
//                 (element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
//                     url_playlist_elem = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${this.settings.CLIENT_ID}&format=jsonpretty&limit=40&id=${element.id}&order=track_id`;
//                     playlist = new PlayList({
//                         list: element.tracks,
//                         title: element.name,
//                         type: "track",
//                         url: url_playlist_elem,
//                     });
//                     this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
//                 }
//             );
//         } else {
//             this.songsDom.insertAdjacentHTML("beforeend", `<h4>Список доступной музыки пуст</h4>`);
//         }
//     }
export function Play(props: any) {
    const [songList, setSongList] = useState([]);
    const [errorMsg, setError] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [url, setUrl] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [audioUrl, setAudioUrl] = useState("#");
    const [nameSong, setNameSong] = useState("");
    const [author, setAuthor] = useState("");
    const [albumImage, setAlbumImage] = useState("#");
    const [curentUrl, setCurentUrl] = useState("#");
    useEffect(() => {
        console.log("HEREEE ")
        // id=5&isPlaylist=false&isArtistlist=true
        const isPlayList = searchParams.get("isPlaylist") === "true";
        const isArtistlist = searchParams.get("isArtistlist") === "true";
        const isLoveSongs = searchParams.get("mode") === "lovesongs";
        const id = searchParams.get("id");

        console.log("props Play", isPlayList, isArtistlist, isLoveSongs, searchParams.get("mode"), id, props)
        // const urlplaylist = `https://api.jamendo.com/v3.0/playlists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&datebetween=2022-01-02_2022-04-01&hasimage=1`;
        // const urlartist = `https://api.jamendo.com/v3.0/artists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&imagesize=100`;
        // const urltop = `https://api.jamendo.com/v3.0/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&include=musicinfo&boost=listens_week&imagesize=100`;
        // const urljenre = `https://api.jamendo.com/v3.0/playlists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12`;
        const urlPlayListTrack = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=20&id=${id}`;
        const urlArtistSongs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&order=track_name_desc&id=${id}`;
        const load = async (type: string, url: string) => {
            const answer: any = await getDataFromApi(url)
            console.log("answer ==>> 1111111111111", answer);
            if (answer.result) {
                // const playlistobj: any = { list: answer.data[0].tracks, title: answer.data[0].name, type: type, url: url };
                setSongList(answer.data[0].tracks)
                setUrl(url);
                setType(type);
                setTitle(answer.data[0].name);

            }
        }
        if (isArtistlist) {
            load("track", urlArtistSongs);
        }
        if (isPlayList) {

            load("track", urlPlayListTrack);
        }
        if (isLoveSongs) {
            prepareLoverSongs();
        }
        // 
    }, [])
    useEffect(() => {

    }, [audioUrl, albumImage, nameSong, errorMsg]);
    //
    async function prepareLoverSongs() {
        let url_playlist_elem, playlist;
        const accessToken = localStorage.getItem("accessToken");
        const id_user = localStorage.getItem("id_user");
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&user_id=${id_user}
                &access_token=${accessToken}`;
        const favorite: any = await getDataFromApi(url_playlist);
        console.log("favorite", favorite)
        if (favorite.result) {
            if (favorite.data.length === 0) {
                return <h4 >Список пуст</h4>;
            }
            let cacheSong: PlayListItemInterface[] = []
            let title = ''
            favorite.data.forEach((element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
                cacheSong = cacheSong.concat(element.tracks)
                title += element.name + "/ ";
                // playlist = new PlayList({
                //     list: element.tracks,
                //     title: element.name,
                //     type: "track",
                //     url: url_playlist_elem,
                // });

                // this.songsDom.insertAdjacentHTML("beforeend", playlist.render());
            });
            setTitle(title);
            console.log("cacheSong", cacheSong)
            setSongList(cacheSong);
            setType("track");
        } else {
            setError("Ошибка:" + favorite.message);
            // this.songsDom.insertAdjacentHTML(
            //     "beforeend",
            //     `<h4>Авторизуйтесь, для получения списка ваших плейлистов.</h4>`
            // );
        }
    }

    const setSong = (data: any) => {
        console.log("setSong===> ", data);
        setAudioUrl(data.audio);
        setNameSong(data.name);
        setAlbumImage(data.album_image);
        setAuthor(data.artist_name)
    }
    const changeSong = (index: any) => {
        setSong(songList[index])
        console.log("changeSong===> ", index, props, songList);
        // setAudioUrl(songList[index].audio);
        // setNameSong(songList[index].name);
        // setAlbumImage(songList[index].album_image);
        // setAuthor(songList[index].album_name)
    }

    return < div className="conten-react" >
        <Auth clientId={props.init.settings.CLIENT_ID} timeBlock={props.init.settings.TIME_TO_BLOCK} />
        {songList.length === 0 ? <h3>Список пуст</h3> :

            <div className="conten-react__content">

                <PlayList setSong={setSong} list={songList} title={title} type={type} url={url} />
            </div>}
        {errorMsg === "" ? "" : errorMsg}
        <AudioPlayer author={author} audioUrl={audioUrl} length={songList.length} albumImage={albumImage} nameSong={nameSong} changeSong={changeSong} />
    </div >


}