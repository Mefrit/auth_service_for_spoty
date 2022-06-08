
import { PlayList } from "../modules/PlayList";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDataFromApi } from "../lib/query";
import { Auth } from "../modules/auth"



import { AudioPlayer } from "./AudioPlayer"

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

    useEffect(() => {
        const isPlayList = searchParams.get("isPlaylist") === "true";
        const isArtistlist = searchParams.get("isArtistlist") === "true";
        const isLoveSongs = searchParams.get("mode") === "lovesongs";
        const id = searchParams.get("id");
        const urlPlayListTrack = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=20&id=${id}`;
        const urlArtistSongs = `https://api.jamendo.com/v3.0/artists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&order=track_name_desc&id=${id}`;
        const load = async (type: string, url: string) => {
            const answer: any = await getDataFromApi(url)
            if (answer.result) {
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
        const accessToken = localStorage.getItem("accessToken");
        const id_user = localStorage.getItem("id_user");
        const url_playlist = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&user_id=${id_user}
                &access_token=${accessToken}`;
        const favorite = await getDataFromApi(url_playlist);
        if (favorite.result) {
            if (favorite.data.length === 0) {
                return <h4 >Список пуст</h4>;
            }
            let cacheSong: PlayListItemInterface[] = []
            let title = ''
            favorite.data.forEach((element: { tracks: PlayListItemInterface[]; name: string; id: string | number }) => {
                cacheSong = cacheSong.concat(element.tracks)
                title += element.name + "/ ";
            });
            setTitle(title);
            setSongList(cacheSong);
            setType("track");
        } else {
            setError("Ошибка:" + favorite.message);
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