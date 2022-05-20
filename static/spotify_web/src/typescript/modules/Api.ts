import { getJSON } from "../lib/query";
export class Api {
    loadSong(songId: string, clientId: string) {
        return new Promise((resolve, reject) => {
            const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=jsonpretty&limit=5&include=musicinfo&id=${songId}`;
            this.getDataFromApi(url).then((answer: any) => {
                resolve(answer);
            });
        });
    }
    loadPlayList(playListId: string, clientId: string) {
        return new Promise((resolve, reject) => {
            const url = `https://api.jamendo.com/v3.0/playlists/tracks/?client_id=${clientId}&format=jsonpretty&limit=40&id=${playListId}`;
            this.getDataFromApi(url).then((answer: any) => {
                resolve(answer);
            });
        });
    }
    getDataFromApi(url: string) {
        return new Promise((resolve, reject) => {
            getJSON(url).then((data: any) => {
                if (data.headers.status === "success") {
                    resolve({ result: true, data: data.results });
                } else {
                    resolve({ result: false, message: data });
                }
            });
        });
    }
}
