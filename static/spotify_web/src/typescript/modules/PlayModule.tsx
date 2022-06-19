
import { PlayList } from "../modules/PlayList";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDataFromApi, postJSON } from "../lib/query";
import { Auth } from "../modules/Auth";
import { AudioPlayer } from "./AudioPlayer";
import { DefaultRequest, PlayProps } from "../interfaces/DefaultInterface";
import { PlayListItemJumendoInterface, trackDataInterface, favoriteUserDataInterface } from "../interfaces/PlayListInterface";
import { DEFAULT_AUDIO_URL, DEFAULT_TRACK_ID } from "../lib/const";

export function Play(props: PlayProps) {
    const [errorMsg, setError] = useState("");
    const [loadState, setLoadState] = useState(true);
    const [playListInfo, setPlayListInfo] = useState({
        songList: [],
        title: "",
        type: "",
        url: ""
    })
    const [searchParams] = useSearchParams();
    const [songInfo, setSongInfo] = useState({
        audioUrl: DEFAULT_AUDIO_URL,
        nameSong: "",
        author: "",
        trackId: DEFAULT_TRACK_ID,
        albumImage: ""
    })
    useEffect(() => {
        const isPlayList = searchParams.get("isPlaylist") === "true";
        const isArtistlist = searchParams.get("isArtistlist") === "true";
        const isLoveSongs = searchParams.get("mode") === "lovesongs";
        const id = searchParams.get("id");
        const urlPlayListTrack = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=20&id=${id}`;
        const urlArtistSongs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&order=track_name_desc&id=${id}`;
        const load = async (type: string, url: string) => {
            const answer: DefaultRequest = await getDataFromApi(url)
            setLoadState(false)
            if (answer.result) {
                if (answer.data.length > 0) {
                    const list = answer.data[0].tracks.filter((elem: trackDataInterface) => elem.audio !== "")
                    setPlayListInfo({
                        songList: list,
                        title: answer.data[0].name,
                        type: type,
                        url: url
                    })
                }
            } else {
                setError("Ошибка: " + answer.message);
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
        if (errorMsg === "No Error") {
            setError("")
        }
    }, [songInfo, errorMsg]);
    async function prepareLoverSongs() {
        const accessToken = localStorage.getItem("accessToken");
        const idUser = localStorage.getItem("idUser");
        const urlPlaylist = `https://api.jamendo.com/v3.0/users/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&user_id=${idUser}
                &access_token=${accessToken}&limit=100`;
        const favorite: DefaultRequest = await getDataFromApi(urlPlaylist);
        if (favorite.result) {
            if (favorite.data.length === 0) {
                return <h4 className="playlist__empty_list" >Список пуст</h4>;
            }
            let cacheSong: trackDataInterface[] = []
            let title = ''
            const data: favoriteUserDataInterface[] = favorite.data;
            data.forEach((element: { tracks: trackDataInterface[]; name: string; id: string | number }) => {
                cacheSong = cacheSong.concat(element.tracks.filter((elem) => elem.audio !== ""))
                title += element.name + "/ ";
            });
            setError("");
            setPlayListInfo({
                songList: cacheSong,
                title,
                type: "track",
                url: ""
            })
        } else {
            setError("Ошибка:" + favorite.message);
        }
    }
    const setTrackToLover = async (trackId: number) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const idUser = localStorage.getItem("idUser");

            const answer = await postJSON("/setTrackToLover", {
                clientId: props.init.settings.CLIENT_ID,
                trackId,
                idUser,
                accessToken
            })

            if (answer.result) {
                alert("Трек успешно добавлен в \"Избранное\"")
            }
        } else {
            alert("Вы не авторизованны.")
        }
    }
    const setSong = (data: PlayListItemJumendoInterface) => {
        setSongInfo({
            audioUrl: data.audio,
            nameSong: data.name,
            author: data.artist_name,
            trackId: data.id,
            albumImage: data.album_image
        })
    }
    const changeSong = (index: number) => {
        setSong(playListInfo.songList[index])
    }
    return <div className="conten-react" >
        <Auth clientId={props.init.settings.CLIENT_ID} timeBlock={props.init.settings.TIME_TO_BLOCK} />
        {searchParams.get("mode") === "lovesongs" ? <div> <h3 className="playlist__title_lover">Избранное </h3> </div> : ""}
        {playListInfo.songList.length === 0 ? <h3 className="playlist__empty_list">Список пуст {loadState ? "(Загрузка...)" : ""}</h3> :
            <div className="conten-react__content">
                <PlayList setSong={setSong} list={playListInfo.songList} title={playListInfo.title} type={playListInfo.type} url={playListInfo.url} />
            </div>}

        {errorMsg === "" ? "" : errorMsg}
        {searchParams.get("mode") === "lovesongs" ? <p className="playlist__description_lover_song">Некоторые треки могут быть не доступны через API, для доступа к ним откройте сайт <a href="https://www.jamendo.com/start" className="playlist__link">Jumendo Music</a>.</p> : ""}
        <AudioPlayer
            author={songInfo.author}
            audioUrl={songInfo.audioUrl}
            length={playListInfo.songList.length}
            trackId={songInfo.trackId}
            setTrackToLover={setTrackToLover}
            albumImage={songInfo.albumImage}
            nameSong={songInfo.nameSong}
            changeSong={changeSong} />
    </div >


}