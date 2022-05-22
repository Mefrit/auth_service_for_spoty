import { SongInfoPlayer } from "./SongInfoPlayer";
import { SettingsInterface, DefaultRequest, SongData, DefaultJumendoRequest } from "../interfaces/defaultInterface";
import { ApiInterface } from "../interfaces/ApiInterface";
import { AudioPlayerInterface } from "../interfaces/AudioPlayerInterface";
import { SongInfoInterface } from "../interfaces/SongInfoInterface";
export class AudioPlayer {
    domAudioPlayer: HTMLAudioElement;
    Api: ApiInterface;
    songInfoPlayer: HTMLElement;
    settings: SettingsInterface;
    playBack: HTMLElement;
    playForward: HTMLElement;
    playProgress: HTMLInputElement;
    playVolume: HTMLElement;
    playSoundMute: HTMLElement;
    playPause: HTMLElement;
    isPlayed: boolean;
    curent_song_index: number;
    curent_api_url: string;
    playTimeStart: HTMLElement;
    playSvgPath: HTMLElement;
    playTimeEnd: HTMLElement;
    curent_volume: number;
    constructor(conf: AudioPlayerInterface) {
        this.isPlayed = false;
        this.domAudioPlayer = conf.audioPlayer;
        this.curent_volume = 50;
        this.curent_song_index = 0;
        this.curent_api_url = "";

        this.Api = conf.api;
        this.settings = conf.settings;
        this.songInfoPlayer = conf.songInfoPlayer;
        this.playBack = conf.playBack;
        this.playForward = conf.playForward;
        this.playProgress = conf.playProgress;
        this.playVolume = conf.playVolume;
        this.playPause = conf.playPause;
        this.playSoundMute = conf.playSoundMute;
        this.playTimeStart = conf.timeStart;
        this.playTimeEnd = conf.timeEnd;
        this.playSvgPath = conf.playSvgPath;
        this.initEvents();
    }
    getTimeFromSecunds(sec: number) {
        const full_minutes = Math.round(sec / 60);
        const secunds = Math.abs(Math.round(sec - full_minutes * 60));
        return ("0" + full_minutes).slice(-2) + ":" + ("0" + secunds).slice(-2);
    }
    timeupdate = () => {
        const currentTime = this.domAudioPlayer.currentTime;
        const duration = this.domAudioPlayer.duration;
        this.playTimeStart.innerHTML = this.getTimeFromSecunds(currentTime + 0.25);
        this.playTimeEnd.innerHTML = this.getTimeFromSecunds(duration);
        this.playProgress.value = Math.round(((currentTime + 0.25) / duration) * 100).toString();
    };
    changePlayProgress = (ev: Event) => {
        if (ev.target) {
            const new_part = (ev.target as HTMLInputElement).value;
            const duration = this.domAudioPlayer.duration;
            this.domAudioPlayer.currentTime = Math.round((duration / 100) * Number(new_part));
        }
    };
    muteSound = () => {
        if (this.domAudioPlayer.volume === 0) {
            this.domAudioPlayer.volume = this.curent_volume / 100;
        } else {
            this.domAudioPlayer.volume = 0;
        }
    };
    playPauseSong = () => {
        if (this.isPlayed) {
            this.playSvgPath.setAttribute(
                "d",
                "M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"
            );
            this.domAudioPlayer.pause();
        } else {
            this.playSvgPath.setAttribute("d", "M0,0 0,16 5,16 5,0z M 15,0 15,16 10,16 10,0z");
            this.domAudioPlayer.play();
        }
        this.isPlayed = !this.isPlayed;
    };
    playForwardEvent = () => {
        this.domAudioPlayer.pause();
        if (this.curent_api_url)
            this.Api.getDataFromApi(this.curent_api_url).then((answer: DefaultRequest) => {
                if (answer.result) {
                    const start_tracks = answer.data[0].tracks ? answer.data[0].tracks : answer.data;
                    const track = start_tracks.filter((elem: { audio: string }) => {
                        return elem.audio !== "";
                    });
                    if (track.length > 0) {
                        if (this.curent_song_index + 1 >= track.length) {
                            this.curent_song_index = 0;
                        } else {
                            this.curent_song_index++;
                        }
                        this.playSong(track[this.curent_song_index]);
                    }
                }
            });
        this.isPlayed = !this.isPlayed;
    };
    playBackEvent = () => {
        this.domAudioPlayer.pause();
        if (this.curent_api_url)
            this.Api.getDataFromApi(this.curent_api_url).then((answer: DefaultRequest) => {
                if (answer.result) {
                    const start_tracks = answer.data[0].tracks ? answer.data[0].tracks : answer.data;
                    if (start_tracks.length > 0) {
                        if (this.curent_song_index - 1 < 0) {
                            this.curent_song_index = start_tracks.length - 1;
                        } else {
                            this.curent_song_index--;
                        }
                        this.playSong(start_tracks[this.curent_song_index]);
                    }
                }
            });
        this.isPlayed = !this.isPlayed;
    };
    initEvents() {
        this.domAudioPlayer.addEventListener("timeupdate", this.timeupdate);
        this.playProgress.addEventListener("change", this.changePlayProgress);
        this.playSoundMute.addEventListener("click", this.muteSound);
        this.playVolume.addEventListener("change", (ev: Event) => {
            if (ev.target) {
                const value = (ev.target as HTMLInputElement).value;
                this.curent_volume = Number(value);
                this.domAudioPlayer.volume = Number(value) / 100;
            }
        });
        this.playPause.addEventListener("click", this.playPauseSong);
        this.playForward.addEventListener("click", this.playForwardEvent);
        this.playBack.addEventListener("click", this.playBackEvent);
    }
    playSong(data: SongInfoInterface) {
        this.songInfoPlayer.innerHTML = "";
        if (data.audio) {
            this.domAudioPlayer.setAttribute("src", data.audio);
        }
        this.domAudioPlayer.play();
        this.isPlayed = true;
        const song_info = new SongInfoPlayer(data);
        this.songInfoPlayer.insertAdjacentHTML("beforeend", song_info.render());
    }
    loadArtistSong(artist_id: string) {
        const params = new URLSearchParams({
            artist_id: artist_id,
            mode: "artist",
        });
        document.location.href = "play?" + params.toString();
    }
    loadPlayList(playListId: string) {
        const params = new URLSearchParams({
            playListId: playListId,
            mode: "playlist",
        });
        document.location.href = "play?" + params.toString();
    }
    loadAlbumSong(album_id: string) {
        const params = new URLSearchParams({
            album_id: album_id,
            mode: "album",
        });
        document.location.href = "play?" + params.toString();
    }
    async play(data: SongData) {
        let answer;
        if (data) {
            this.curent_api_url = data.url;
            this.curent_song_index = data.index;
            if (data.isPlaylist) {
                await this.loadPlayList(data.id);
            }
            if (data.isArtist) {
                await this.loadArtistSong(data.id);
            }
            if (data.isAlbum) {
                await this.loadAlbumSong(data.id);
            }
            answer = await this.Api.loadSong(data.id, this.settings.clientId);

            if (answer.result && answer.data.length > 0) {
                this.playSvgPath.setAttribute("d", "M0,0 0,16 5,16 5,0z M 15,0 15,16 10,16 10,0z");
                this.playSong(answer.data[0]);
            } else {
                this.domAudioPlayer.pause();
            }
        }
    }
}
