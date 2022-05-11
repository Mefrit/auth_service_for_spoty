export class SongInfoPlayer {
    item: any;
    constructor(item: any) {
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
        // <a href="/lover?type=add" class="song__add2collection">
        //     <svg role="img" height="16" width="16" class="song__imgadd2collection" viewBox="0 0 16 16">
        //         <path d="M15.724 4.22A4.313 4.313 0 0012.192.814a4.269 4.269 0 00-3.622 1.13.837.837 0 01-1.14 0 4.272 4.272 0 00-6.21 5.855l5.916 7.05a1.128 1.128 0 001.727 0l5.916-7.05a4.228 4.228 0 00.945-3.577z"></path>
        //     </svg>
        // </a>;
    }
}
