import { PlayListItem } from "./PlaylistItem";
import React from "react";
import { PlayListItemJumendoInterface } from "../interfaces/PlayListInterface";
import { PlayListProps } from "../interfaces/PlayListInterface";

export function PlayList(props: PlayListProps) {
    function renderListItemOld(list: PlayListItemJumendoInterface[]) {
        if (list.length === 0) {
            return [<h4 className="playlist__empty_list">Список пуст</h4>];
        }
        let sorted = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].audio !== "") {
                sorted.push(list[i])
            }
        }
        let renderlist = [];
        for (let j = 0; j < sorted.length; j++) {
            renderlist.push(<PlayListItem setSong={props.setSong} item={sorted[j]} type={props.type} url={props.url} index={j} key={props.url + j} />)
        }
        return renderlist
    }

    function renderListItem(list: PlayListItemJumendoInterface[]) {
        if (list.length === 0) {
            return [<h4 className="playlist__empty_list">Список пуст</h4>];
        }
        return list
            .filter((elem) => elem.audio !== "")
            .map((elem: PlayListItemJumendoInterface, index, arr) => {
                return <PlayListItem setSong={props.setSong} item={elem} type={props.type} url={props.url} index={index} key={props.url + index} />;
            });
    }
    return <div className={props.type === "track" ? "playlist playlist-track" : "playlist"}>
        <h3 className="album-container__title">{props.title}</h3>
        <section className={
            props.type === "track" ? "album-container album-container_track" : "album-container"
        }>
            {renderListItem(props.list)}
        </section>
    </div >;

}
