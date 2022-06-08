import { SongInfoPlayer } from "./SongInfoPlayer";
import { SettingsInterface, DefaultRequest, SongData, DefaultJumendoRequest } from "../interfaces/DefaultInterface";
import { ApiInterface } from "../interfaces/ApiInterface";
import { AudioPlayerInterface } from "../interfaces/AudioPlayerInterface";
import React, { useEffect, useState, useRef } from "react"

export function AudioPlayer(props: any) {
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(props.songUrl));
    const intervalRef: any = useRef();
    const isReady = useRef(false);
    const [volume, setVolume] = useState(0.5)
    useEffect(() => {

    })
    const toPrevTrack = () => {

        let index_tmp = trackIndex - 1;
        if (index_tmp < 0) {
            index_tmp = props.length - 1;
        }
        props.changeSong(index_tmp)
        setTrackIndex(index_tmp)
    }
    function getTimeFromSecunds(sec: number) {
        if (!sec) {
            return "00:00"
        }
        const full_minutes = Math.round(sec / 60);
        const secunds = Math.abs(Math.round(sec - full_minutes * 60));
        return ("0" + full_minutes).slice(-2) + ":" + ("0" + secunds).slice(-2);
    }
    const toNextTrack = () => {
        let index_tmp = trackIndex + 1;
        if (index_tmp >= props.length) {
            index_tmp = 0;
        }
        setTrackIndex(index_tmp)
        props.changeSong(index_tmp)
    }
    useEffect(() => {
        return () => {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        }
    }, []);
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            startTimer(audioRef);
        } else {
            clearInterval(intervalRef.current);
            audioRef.current.pause();
        }
    }, [isPlaying]);
    const onScrub = (value: number) => {
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
        startTimer(audioRef);
    }
    useEffect(() => {
        audioRef.current.volume = volume;

    }, [volume]);
    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(props.audioUrl);
        setTrackProgress(audioRef.current.currentTime);
        if (isReady.current) {
            audioRef.current.play();
            setIsPlaying(true);
            startTimer(audioRef);
        } else {
            isReady.current = true;
        }
    }, [trackIndex, props.audioUrl]);
    const startTimer = (audioRef) => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                toNextTrack();
            } else {
                console.log("HEREE", trackProgress,)
                setTrackProgress(audioRef.current.currentTime);
            }
        }, 1000);
    }

    return <div className="audio-player">
        <div id="song-info-player">
            <div className="song">
                {props.albumImage != "#" ? <img src={props.albumImage} alt="Logo" className="song__icon" title="Logo" /> : ""}
                <div className="song__info">

                    <div className='song__description' >
                        <span className="song__title">{props.nameSong}</span>
                        <p className="song__author">{props.author}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="audio-player__interface">
            <div className="action">

                <button className="action__back" id="play-back" onClick={toPrevTrack}>
                    <svg role="img" height="16" width="16" viewBox="0 0 16 16">
                        <path
                            d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z"
                        ></path>
                    </svg>
                </button>
                <button className="play-btn" id="play-pause" onClick={() => { setIsPlaying(!isPlaying) }}>
                    <svg
                        role="img"
                        className="play-btn__image"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        viewBox="0 0 16 16"
                    >

                        <path
                            id="playSvgPath"
                            d={isPlaying ? "M0,0 0,16 5,16 5,0z M 15,0 15,16 10,16 10,0z" : "M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"}
                        ></path>

                    </svg>
                </button>
                <button className="action__forward" id="play-forward" onClick={toNextTrack}>
                    <svg
                        role="img"
                        height="16"
                        className="play-btn__image"
                        width="16"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"
                        ></path>
                    </svg>
                </button>

            </div>
            <div className="action__progress">
                <span className="action__time" id="play-time-start">{getTimeFromSecunds(audioRef.current.currentTime)}</span>
                <input
                    className="action__progress_range"
                    id="play-progress"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    onChange={(e: any) => onScrub(e.target.value)}
                    value={trackProgress}
                />
                <span className="action__time" id="play-time-end">{getTimeFromSecunds(audioRef.current.duration)}</span>
            </div>
        </div>
        <div className="options">
            <button className="options__volume-icon" id="play-sound-mute">
                <svg
                    role="presentation"
                    height="16"
                    width="16"
                    className="options__image"
                    id="volume-icon"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 010 4.88z"
                    ></path>
                    <path d="M11.5 13.614a5.752 5.752 0 000-11.228v1.55a4.252 4.252 0 010 8.127v1.55z"></path>
                </svg>
            </button>
            <input className="options__volume" id="play-volume" type="range" min="0" max="1" step="0.01" onChange={(ev: any) => { setVolume(ev.target.value) }} value={volume} />
        </div>

    </div >
}