import { SongInfoPlayer } from "./SongInfoPlayer";
export class AudioPlayer {
    dom_audio_player: any;
    Api: any;
    song_info_player: any;
    settings: any;
    play_back: any;
    play_forward: any;
    play_progress: any;
    play_volume: any;
    play_sound_mute: any;
    play_pause: any;
    is_played: boolean;
    curent_song_index: number;
    curent_api_url: string;
    play_time_start: any;
    play_svg_path: any;
    play_time_end: any;
    curent_volume: number;
    constructor(conf: any) {
        this.is_played = false;
        this.dom_audio_player = conf.audio_player;
        this.curent_volume = 50;
        this.curent_song_index = 0;
        this.curent_api_url = "";

        this.Api = conf.api;
        this.settings = conf.settings;
        this.song_info_player = conf.song_info_player;
        this.play_back = conf.play_back;
        this.play_forward = conf.play_forward;
        this.play_progress = conf.play_progress;
        this.play_volume = conf.play_volume;
        this.play_pause = conf.play_pause;
        this.play_sound_mute = conf.play_sound_mute;
        this.play_time_start = conf.time_start;
        this.play_time_end = conf.time_end;
        this.play_svg_path = conf.play_svg_path;
        this.initEvents();
    }
    getTimeFromSecunds(sec: number) {
        const full_minutes = Math.round(sec / 60);
        const secunds = Math.abs(Math.round(sec - full_minutes * 60));
        return ("0" + full_minutes).slice(-2) + ":" + ("0" + secunds).slice(-2);
    }
    timeupdate = () => {
        const current_time = this.dom_audio_player.currentTime;
        const duration = this.dom_audio_player.duration;

        this.play_time_start.innerHTML = this.getTimeFromSecunds(current_time + 0.25);

        this.play_time_end.innerHTML = this.getTimeFromSecunds(duration);
        this.play_progress.value = Math.round(((current_time + 0.25) / duration) * 100);
    };
    changePlayProgress = (ev: any) => {
        const new_part = ev.target.value;
        const duration = this.dom_audio_player.duration;
        this.dom_audio_player.currentTime = Math.round((duration / 100) * new_part);
    };
    muteSound = () => {
        if (this.dom_audio_player.volume === 0) {
            this.dom_audio_player.volume = this.curent_volume / 100;
        } else {
            this.dom_audio_player.volume = 0;
        }
    };
    playPauseSong = () => {
        if (this.is_played) {
            this.play_svg_path.setAttribute(
                "d",
                "M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"
            );
            this.dom_audio_player.pause();
        } else {
            this.play_svg_path.setAttribute("d", "M0,0 0,16 5,16 5,0z M 15,0 15,16 10,16 10,0z");
            this.dom_audio_player.play();
        }
        this.is_played = !this.is_played;
    };
    playForward = () => {
        this.dom_audio_player.pause();

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
        this.dom_audio_player.pause();

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
        this.dom_audio_player.addEventListener("timeupdate", this.timeupdate);
        this.play_progress.addEventListener("change", this.changePlayProgress);
        this.play_sound_mute.addEventListener("click", this.muteSound);
        this.play_volume.addEventListener("change", (ev: any) => {
            this.curent_volume = ev.target.value;
            this.dom_audio_player.volume = ev.target.value / 100;
        });
        this.play_pause.addEventListener("click", this.playPauseSong);
        this.play_forward.addEventListener("click", this.playForward);
        this.play_back.addEventListener("click", this.playBack);
    }

    playSong(data: any) {
        this.song_info_player.innerHTML = "";
        this.dom_audio_player.setAttribute("src", data.audio);
        this.dom_audio_player.play();
        this.is_played = true;
        const song_info = new SongInfoPlayer(data);
        this.song_info_player.insertAdjacentHTML("beforeend", song_info.render());
    }
    loadArtistSong(artist_id: any) {
        const params = new URLSearchParams({
            artist_id: artist_id,
            mode: "artist",
        });
        document.location.href = "play?" + params.toString();
    }
    loadPlayList(play_list_id: string) {
        const params = new URLSearchParams({
            play_list_id: play_list_id,
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
            if (data.is_playlist) {
                await this.loadPlayList(data.id);
            }
            if (data.is_artist) {
                await this.loadArtistSong(data.id);
            }
            if (data.is_album) {
                await this.loadAlbumSong(data.id);
            }
            answer = await this.Api.loadSong(data.id, this.settings.client_id);

            if (answer.result && answer.data.length > 0) {
                this.play_svg_path.setAttribute("d", "M0,0 0,16 5,16 5,0z M 15,0 15,16 10,16 10,0z");
                this.playSong(answer.data[0]);
            } else {
                this.dom_audio_player.pause();
            }
        }
    }
}
