import { PlayListItem } from "./PlaylistItem";
export class PlayList {
    list: any;
    title: string;
    type: string;
    url: string;
    constructor(conf: any) {
        this.list = conf.list;
        this.title = conf.title;
        this.type = conf.type;
        this.url = conf.url;
    }
    renderListItem(list: any[]): string[] {
        let play_list_item;
        if (list.length === 0) {
            return ["<h4>Список пуст</h4>"];
        }
        return list
            .filter((elem) => elem.audio !== "")
            .map((elem: any, index, arr) => {
                play_list_item = new PlayListItem(elem, this.type, this.url, index);
                return play_list_item.render();
            });
    }
    render() {
        return ` <h3 class="album-container__title">${this.title}</h3><section class='${
            this.type === "track" ? "album-container album-container_track" : "album-container"
        }'> ${this.renderListItem(this.list).join("")} </section>`;
    }
}
