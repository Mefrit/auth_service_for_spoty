import { SongInfoPlayer } from "./SongInfoPlayer";
export class AudioPlayer {
    dom_audioPlayer: any;
    Api: any;
    songInfoPlayer: any;
    settings: any;
    playBack: HTMLElement;
    playForward: HTMLElement;
    playProgress: HTMLElement | any;
    playVolume: HTMLElement;
    playSoundMute: HTMLElement;
    playPause: HTMLElement;
    is_played: boolean;
    curent_song_index: number;
    curent_api_url: string;
    play_timeStart: HTMLElement;
    playSvgPath: HTMLElement;
    play_timeEnd: HTMLElement;
    curent_volume: number;
    constructor(conf: any) {
        this.is_played = false;
        this.dom_audioPlayer = conf.audioPlayer;
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
        this.play_timeStart = conf.timeStart;
        this.play_timeEnd = conf.timeEnd;
        this.playSvgPath = conf.playSvgPath;
        this.initEvents();
    }
    getTimeFromSecunds(sec: number) {
        const full_minutes = Math.round(sec / 60);
        const secunds = Math.abs(Math.round(sec - full_minutes * 60));
        return ("0" + full_minutes).slice(-2) + ":" + ("0" + secunds).slice(-2);
    }
    timeupdate = () => {
        const current_time = this.dom_audioPlayer.currentTime;
        const duration = this.dom_audioPlayer.duration;

        this.play_timeStart.innerHTML = this.getTimeFromSecunds(current_time + 0.25);

        this.play_timeEnd.innerHTML = this.getTimeFromSecunds(duration);
        this.playProgress.value = Math.round(((current_time + 0.25) / duration) * 100);
    };
    changePlayProgress = (ev: any) => {
        const new_part = ev.target.value;
        const duration = this.dom_audioPlayer.duration;
        this.dom_audioPlayer.currentTime = Math.round((duration / 100) * new_part);
    };
    muteSound = () => {
        if (this.dom_audioPlayer.volume === 0) {
            this.dom_audioPlayer.volume = this.curent_volume / 100;
        } else {
            this.dom_audioPlayer.volume = 0;
        }
    };
    playPauseSong = () => {
        if (this.is_played) {
            this.playSvgPath.setAttribute(
                "d",
                "M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"
            );
            this.dom_audioPlayer.pause();
        } else {
            this.playSvgPath.setAttribute("d", "M0,0 0,16 5,16 5,0z M 15,0 15,16 10,16 10,0z");
            this.dom_audioPlayer.play();
        }
        this.is_played = !this.is_played;
    };
    playForward = () => {
        this.dom_audioPlayer.pause();

        if (this.curent_api_url)
            this.Api.getDataFromApi(this.curent_api_url).then((answer: any) => {
                if (answer.result) {
                    const start_tracks = answer.data[0].tracks ? answer.data[0].tracks : answer.data;

                    const track = start_tracks.filter((elem: any) => {
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
        this.is_played = !this.is_played;
    };
    playBack = () => {
        this.dom_audioPlayer.pause();

        if (this.curent_api_url)
            this.Api.getDataFromApi(this.curent_api_url).then((answer: any) => {
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
        this.is_played = !this.is_played;
    };
    initEvents() {
        this.dom_audioPlayer.addEventListener("timeupdate", this.timeupdate);
        this.playProgress.addEventListener("change", this.changePlayProgress);
        this.playSoundMute.addEventListener("click", this.muteSound);
        this.playVolume.addEventListener("change", (ev: any) => {
            this.curent_volume = ev.target.value;
            this.dom_audioPlayer.volume = ev.target.value / 100;
        });
        this.playPause.addEventListener("click", this.playPauseSong);
        this.playForward.addEventListener("click", this.playForward);
        this.playBack.addEventListener("click", this.playBack);
    }

    playSong(data: any) {
        this.songInfoPlayer.innerHTML = "";
        this.dom_audioPlayer.setAttribute("src", data.audio);
        this.dom_audioPlayer.play();
        this.is_played = true;
        const song_info = new SongInfoPlayer(data);
        this.songInfoPlayer.insertAdjacentHTML("beforeend", song_info.render());
    }
    loadArtistSong(artist_id: any) {
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
    async play(data: any) {
        let answer: any;
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
                this.dom_audioPlayer.pause();
            }
        }
    }
}
