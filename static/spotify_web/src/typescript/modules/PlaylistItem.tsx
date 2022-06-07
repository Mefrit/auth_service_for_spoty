import { PlayListItemInterface } from "../interfaces/PlayListInterface";
import React from "react";
import { Link } from "react-router-dom";
export function PlayListItem(props: any) {
    // item: PlayListItemInterface;
    // url: string;
    // type: string;
    // index: string | number;
    // constructor(item: PlayListItemInterface, type: string, url: string = "", index: number) {
    //     this.item = item;
    //     this.type = type;
    //     this.url = url;
    //     this.index = index;
    // }
    function getImageHref(item: PlayListItemInterface) {
        let href = "./static/spotify_web/public/images/album.jpg";
        if (item.image) {
            href = item.image;
        }
        if (item.albumImage) {
            href = item.albumImage;
        }
        return href;
    }
    function getTitleItem(item: PlayListItemInterface, type: string) {
        let title = "Не известно";

        if (item.name) {
            title = item.name;
        }
        if (item.albumName && type !== "track") {
            title = item.albumName;
        }
        return title;
    }
    function getDescription(item: PlayListItemInterface) {
        let description = "";
        if (item.musicinfo) {
            description += "Жанры: " + item.musicinfo.tags.genres.join(" ") + ".";
            description += "\nИнструменты " + item.musicinfo.tags.instruments.join(" ") + ".";
        }
        if (item.releasedate) {
            description += "\nДата релиза " + item.releasedate + ".";
        } else {
            if (item.creationdate) {
                description += "\nДата релиза " + item.creationdate + ".";
            }
        }
        if (item.artistName) {
            description += "\nАвтор " + item.artistName + ".";
        }
        return description;
    }
    function getParamsByType(props: any) {
        let patams: any = {};
        patams.id = props.item.id;
        patams.isPlaylist = props.type === "playlist";
        patams.isArtistlist = props.type === "artist";

        return encodeQueryData(patams);
    }
    function encodeQueryData(data: any) {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }
    // getInfPlayer(item: PlayListItemInterface, url: string, index: string | number) {
    //     let inf;
    //     if (item.id) {
    //         inf = { id: item.id };
    //     }
    //     if (url) {
    //         inf = { ...inf, index: index, url: url };
    //     }
    //     inf = { ...inf, index: index, url: url, isAlbum: this.type === "album", isArtist: this.type === "artist" };
    //     if (this.type === "playlist") {
    //         inf = {
    //             ...inf,
    //             isPlaylist: true,
    //         };
    //     }

    //     return JSON.stringify(inf);
    // }
    const choseSonglist = (item: any) => {
        props.setSong(item)
    }
    // const inf_for_player = this.getInfPlayer(this.item, this.url, this.index);\
    //  loadArtistSong(artist_id: string) {
    //     const params = new URLSearchParams({
    //         artist_id: artist_id,
    //         mode: "artist",
    //     });
    //     document.location.href = "play?" + params.toString();
    // }
    // loadPlayList(playListId: string) {
    //     const params = new URLSearchParams({
    //         playListId: playListId,
    //         mode: "playlist",
    //     });
    //     document.location.href = "play?" + params.toString();
    // }
    // loadAlbumSong(album_id: string) {
    //     const params = new URLSearchParams({
    //         album_id: album_id,
    //         mode: "album",
    //     });
    //     document.location.href = "play?" + params.toString();
    // }
    return <div className="album-container__song-container">
        <div className={props.type === "track" ? " album_column" : "album"} >
            <div className={props.type === "track" ? " album_column__image-container" : "album__image"}>
                <img src={getImageHref(props.item)} alt="icon" className="album__image" />
                {/* {data - info - music={inf_for_player} } */}
                {
                    props.type === "track" ? <ButtonPlay type={props.type} item={props.item} choseSonglist={choseSonglist} /> :
                        <Link to={"/play?" + getParamsByType(props)}>
                            <ButtonPlay type={props.type} choseSonglist={choseSonglist} />
                        </Link>
                }
            </div>
            <h5 className="album__title">{getTitleItem(props.item, props.type)}</h5>
            <p className="album__description">{getDescription(props.item)}</p>
        </div>
    </div>
}
function ButtonPlay(props: any) {
    return <button className={props.type === "track" ? " play-btn" : "play-btn play-btn_album"} onClick={() => { props.choseSonglist(props.item) }}>
        <svg
            className="play-btn__image play-btn__image_album"
            role="img"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            viewBox="0 0 16 16"

            data-info-music='${inf_for_player}'
        >
            <path
                data-info-music='${inf_for_player}'
                d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"
            ></path>
        </svg>
    </button>
}