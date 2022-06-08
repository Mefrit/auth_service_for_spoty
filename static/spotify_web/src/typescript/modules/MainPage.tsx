import { getDataFromApi } from "../lib/query";
import { PlayList } from "../modules/PlayList";
import { AudioPlayer } from "../modules/AudioPlayer";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Auth } from "./auth";

export function MainPage(props: any) {
    const [songlist, setSongLists] = useState([]);
    const [tracklist, setTrackLists] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [index, setIndex] = useState(0);
    useEffect(() => {
        let curentSongList: any = songlist
        const urlplaylist = `https://api.jamendo.com/v3.0/playlists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&datebetween=2022-01-02_2022-04-01&hasimage=1`;
        const urlartist = `https://api.jamendo.com/v3.0/artists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&imagesize=100`;
        const urltop = `https://api.jamendo.com/v3.0/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&include=musicinfo&order=popularity_week&imagesize=100`;
        const urljenre = `https://api.jamendo.com/v3.0/playlists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12`;
        const load = async (type: string, title: string, url: string) => {
            const answer: any = await getDataFromApi(url)
            if (answer.result) {
                const playlistobj = { list: answer.data, title: title, type: type, url: url };
                const newplaylists: any = addNewPlayListIntoCache(curentSongList, playlistobj);
                curentSongList = [...newplaylists];
                if (type === 'track') {
                    setTrackLists(answer.data)
                }
                setSongLists(newplaylists)
            }
        }

        load("playlist", "Подборки", urljenre);
        load("artist", "Исполнители", urlartist);
        setTimeout(() => {

            load("track", "Популярное за неделю", urltop);
        }, 1000)
        load("playlist", "Плейлисты", urlplaylist);



    }, [])

    function addNewPlayListIntoCache(cache: any, playlist: any) {
        const newplaylist = [...cache];
        newplaylist.push(playlist)
        return newplaylist;
    }
    function getIndexByIdInPlayList(list: any, id: number) {
        let findIndex = 0;
        list.forEach((elem: any, index: number, arr: any) => {
            if (elem.id === id) {
                findIndex = index;
            }
        })
        return findIndex;
    }
    const changeSong = (elem: any) => {
        console.log("index", elem);
        if (elem.id) {
            const index: number = getIndexByIdInPlayList(tracklist, elem.id);
            setIndex(index)
        }

    }
    const changeSongFromAudio = (index: number) => {
        setIndex(index)
    }
    function getTrackList(songlist: any) {
        return songlist.filter((elem: any) => elem.type === "track")
    }
    function renderContent(songlist) {
        console.log("renderContent", tracklist, songlist)
        if (songlist.length === 0) {
            return "Загрузка..."
        }
        // return " 123"
        return songlist.map((elem, index, arr) => {
            return <PlayList setSong={changeSong} list={elem.list} title={elem.title} type={elem.type} url={elem.url} />;
        })
    }
    console.log(":songlist ", songlist, "|=> ", getTrackList(songlist), tracklist[index]);

    return <div>
        <Auth clientId={props.init.settings.CLIENT_ID} timeBlock={props.init.settings.TIME_TO_BLOCK} />
        <div className="conten-react__content"> {renderContent(songlist)} </div>
        {
            tracklist[index] ?
                <AudioPlayer audioUrl={tracklist[index].audio} author={tracklist[index].artist_name} length={tracklist.length} albumImage={tracklist[index].album_image}
                    nameSong={tracklist[index].name} changeSong={changeSongFromAudio} /> :
                <div></div>
        }


    </div>
}