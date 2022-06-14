import { PlayList } from "./modules/PlayList"
import { AudioPlayer } from "./modules/AudioPlayer"
import { getDataFromApi } from "./lib/query";
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
    const [nameSong, setNameSong] = useState("");
    const [author, setAuthor] = useState("");
    const [albumImage, setAlbumImage] = useState("#");
    const [audioUrl, setAudioUrl] = useState("#");
    const [trackId, setTrackId] = useState(-1)
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
            });
        }

    };
    const setSong = (data: any) => {
        console.log("setSong===> ", data);
        setAudioUrl(data.audio);
        setNameSong(data.name);
        setAlbumImage(data.album_image);
        setAuthor(data.album_name)
        setTrackId(data.id)
    }
    function renderTrack(list: any) {
        if (list.length === 0) {
            return "Введите параметры поиска"
        }
        return <PlayList setSong={setSong} list={list} title={searchparams} type={"track"} url={""} />
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


        <AudioPlayer author={author} audioUrl={audioUrl} length={tracklist.length} id_track={trackId} albumImage={albumImage} nameSong={nameSong} changeSong={changeSong} />
    </div>
}
const config = {

    settings: settings
}
const root = ReactDOM.createRoot(document.getElementById("rootsearch"));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/search" element={<Search init={config} />} />
        </Routes>
    </BrowserRouter>
);
