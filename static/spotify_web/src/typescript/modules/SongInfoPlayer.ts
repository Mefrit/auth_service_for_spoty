import { SongInfoInterface } from "../interfaces/SongInfoInterface";
export class SongInfoPlayer {
    item: SongInfoInterface;
    constructor(item: SongInfoInterface) {
        this.item = item;
    }
    render() {
        return `<div class="song">
                ${this.item.image ? `<img src='${this.item.image}'  class="song__icon" title="Logo"/>` : ""} 
                <div class="song__info">
                   
                    <div class= 'song__description' >
                        <span class="song__title">${this.item.name}</span>
                        <p class="song__author">${this.item.artist_name}</p>
                    </div>
                </div>
            </div>
        `;
    }
}
