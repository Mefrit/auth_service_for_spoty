import { getDataFromApi } from "../lib/query";
import { PlayList } from "../modules/PlayList";
import { AudioPlayer } from "../modules/AudioPlayer";
import React from "react";
import { useEffect, useState } from "react";
import { postJSON } from "../lib/query"
import { Auth } from "./Auth";
import { PlayListItemJumendoInterface } from "../interfaces/PlayListInterface"
import { playListInterface, MainPageProps } from "../interfaces/MainPageInterface";

export function MainPage(props: MainPageProps) {
    enum AnswerType {
        Track = 'track'
    }
    const [songlist, setSongLists] = useState<playListInterface[]>([]);
    const [tracklist, setTrackLists] = useState<PlayListItemJumendoInterface[]>([]);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        let curentSongList: playListInterface[] = songlist
        const urlplaylist = `https://api.jamendo.com/v3.0/playlists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&datebetween=2021-01-02_2022-06-01&hasimage=1`;
        const urlartist = `https://api.jamendo.com/v3.0/artists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12&imagesize=100`;
        const urltop = `https://api.jamendo.com/v3.0/tracks/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=13&include=musicinfo&order=popularity_week&imagesize=100`;
        const urljenre = `https://api.jamendo.com/v3.0/playlists/?client_id=${props.init.settings.CLIENT_ID}&format=jsonpretty&limit=12`;
        const load = async (type: string, title: string, url: string) => {
            const answer: { result: boolean, data: PlayListItemJumendoInterface[] } = await getDataFromApi(url)
            if (answer.result) {
                const playlistobj: playListInterface = { list: answer.data, title: title, type: type, url: url };
                const newplaylists: playListInterface[] = addNewPlayListIntoCache(curentSongList, playlistobj);
                curentSongList = [...newplaylists];
                if (type === AnswerType.Track) {
                    const list: PlayListItemJumendoInterface[] = answer.data.filter((elem) => elem.audio !== "")
                    setTrackLists(list)
                }
                setSongLists(newplaylists)
            }
        }
        load("playlist", "Подборки", urljenre);
        load("artist", "Исполнители", urlartist);
        setTimeout(() => {
            load("track", "Популярное за неделю", urltop);
        }, 1200)
        load("playlist", "Плейлисты", urlplaylist);

    }, [])
    function addNewPlayListIntoCache(cache: playListInterface[], playlist: playListInterface) {
        const newplaylist = [...cache];
        newplaylist.push(playlist)
        return newplaylist;
    }
    function getIndexByIdInPlayList(list: PlayListItemJumendoInterface[], id: number) {
        let findIndex = 0;
        list.forEach((elem: PlayListItemJumendoInterface, index: number, arr: PlayListItemJumendoInterface[]) => {
            if (Number(elem.id) === id) {
                findIndex = index;
            }
        })
        return findIndex;
    }
    const changeSong = (elem: PlayListItemJumendoInterface) => {
        if (elem?.id) {
            const index: number = getIndexByIdInPlayList(tracklist, Number(elem.id));
            setIndex(index)
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
                alert("Трек добавлен в избранное.");
            }
        } else {
            alert("Вы не авторизованны.")
        }
    }
    const changeSongFromAudio = (index: number) => {
        setIndex(index)
    }
    function renderContent(songlist: playListInterface[]) {
        if (songlist.length === 0) {
            return <h4 className="playlist__loading">Загрузка...</h4>
        }
        return songlist.map((elem: playListInterface, index: number, arr: playListInterface[]) => {
            return <PlayList setSong={changeSong} list={elem.list} key={index + elem.title} title={elem.title} type={elem.type} url={elem.url} />;
        })
    }
    return <div>
        <Auth clientId={props.init.settings.CLIENT_ID} timeBlock={props.init.settings.TIME_TO_BLOCK} />

        <div className="content-react__content"> {renderContent(songlist)} </div>
        {
            tracklist[index] ?
                <AudioPlayer
                    audioUrl={tracklist[index].audio}
                    author={tracklist[index].artist_name}
                    trackId={Number(tracklist[index].id)}
                    length={tracklist.length}
                    setTrackToLover={setTrackToLover}
                    albumImage={tracklist[index].album_image}
                    nameSong={tracklist[index].name}
                    changeSong={changeSongFromAudio} /> :
                <div></div>
        }
    </div>
}