import { PlayListItemInterface } from "../interfaces/PlayListInterface";
import React from "react";
import { Link } from "react-router-dom";
export function PlayListItem(props: any) {
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
        if (item.artist_name) {
            description += "\n " + item.artist_name + ".";
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

    const choseSonglist = (item: any) => {
        props.setSong(item)
    }
    return <div className="album-container__song-container">
        <div className={props.type === "track" ? " album_column" : "album"} >
            <div className={props.type === "track" ? " album_column__image-container" : "album__image"}>
                <img src={getImageHref(props.item)} alt="icon" className="album__image" />
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