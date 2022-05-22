import { getJSON } from "../lib/query";
import { DefaultJumendoRequest } from "../interfaces/defaultInterface";
import { ApiInterface } from "../interfaces/ApiInterface";
export class Api implements ApiInterface {
    loadSong(songId: string, clientId: string) {
        return new Promise((resolve, reject) => {
            const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&limit=5&include=musicinfo&id=${songId}`;
            this.getDataFromApi(url).then((answer) => {
                resolve(answer);
            });
        });
    }
    loadPlayList(playListId: string, clientId: string) {
        return new Promise((resolve, reject) => {
            const url = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${clientId}&format=jsonpretty&limit=40&id=${playListId}`;
            this.getDataFromApi(url).then((answer) => {
                resolve(answer);
            });
        });
    }
    getDataFromApi(url: string) {
        return new Promise((resolve, reject) => {
            getJSON(url).then((data: DefaultJumendoRequest) => {
                if (data.headers.status === "success") {
                    resolve({ result: true, data: data.results });
                } else {
                    resolve({ result: false, message: data });
                }
            });
        });
    }
}
