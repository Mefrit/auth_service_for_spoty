export class PlayListItem {
    item: any;
    url: string;
    type: string;
    index: string | number;
    constructor(item: any, type: string, url: string = "", index: any) {
        this.item = item;
        this.type = type;
        this.url = url;
        this.index = index;
    }
    getImageHref(item: any) {
        let href = "./static/spotify_web/public/images/album.jpg";
        if (item.image) {
            href = item.image;
        }
        if (item.albumImage) {
            href = item.albumImage;
        }
        return href;
    }
    getTitleItem(item: any) {
        let title = "Не известно";

        if (item.name) {
            title = item.name;
        }
        if (item.albumName && this.type !== "track") {
            title = item.albumName;
        }
        return title;
    }
    getDescription(item: any) {
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
    getInfPlayer(item: any, url: string, index: string | number) {
        let inf: any = {};
        if (item.id) {
            inf.id = item.id;
        }
        if (item.playlistadddate || item.albumName) {
            if (url) {
                inf.index = index;
                inf.url = url;
            }
        }
        if (this.type === "album") {
            inf.isAlbum = true;
        } else {
            inf.isAlbum = false;
        }
        if (this.type === "artist") {
            inf.isArtist = true;
        } else {
            inf.isArtist = false;
        }

        if (this.type === "playlist") {
            inf.isPlaylist = true;
        }
        return JSON.stringify(inf);
    }
    render() {
        const inf_for_player = this.getInfPlayer(this.item, this.url, this.index);
        return ` <div class="album-container__song-container">
                <div class='${this.type === "track" ? " album_column" : "album"}' >
                    <div class='${
                        this.type === "track" ? " album_column__image-container" : "album__image"
                    }' "album__image-container">
                        <img src="${this.getImageHref(this.item)}" alt="icon" class="album__image" />
                    
                            <button class=' ${
                                this.type === "track" ? " play-btn" : "play-btn play-btn_album"
                            }' data-info-music='${inf_for_player}'>
                                <svg
                                    class="play-btn__image play-btn__image_album"
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
                          
                    </div>
                    <h5 class="album__title">${this.getTitleItem(this.item)}</h5>
                    <p class="album__description">${this.getDescription(this.item)}</p>
                </div>
            </div>
        `;
    }
}
