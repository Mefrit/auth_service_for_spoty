import { PlayListItem } from "./PlaylistItem";
import React from "react";
import { PlayListItemInterface } from "../interfaces/PlayListInterface";
export interface PlayListProps {
    setSong: (index: object) => void
    list: PlayListItemInterface[]
    title: string
    type: string
    url: string
}
export function PlayList(props: PlayListProps) {
    function renderListItem(list: PlayListItemInterface[]) {
        if (list.length === 0) {
            return [<h4>Список пуст</h4>];
        }
        return list
            .filter((elem) => elem.audio !== "")
            .map((elem: PlayListItemInterface, index, arr) => {
                return <PlayListItem setSong={props.setSong} item={elem} type={props.type} url={props.url} index={index} key={props.url + index} />;
            });
    }

    return <div className="playlist">
        <h3 className="album-container__title">{props.title}</h3>
        <section className={
            props.type === "track" ? "album-container album-container_track" : "album-container"
        }>
            {renderListItem(props.list)}
        </section>
    </div >;

}
