import { getParams } from "./lib/query";
import { PlayList } from "./modules/PlayList";
// import { AudioPlayer } from "./modules/AudioPlayer";
import { setUserInfoFromStorage } from "./lib/reqistration";
import { Api } from "./modules/Api";
import { settings } from "./settings";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import { useSearchParams } from "react-router-dom";
import { MainPage } from "./App"
import { postJSON, getCurentUserInfo, getDataFromApi } from "./lib/query";
import {
    userInfoDom,
    songs,
    audioPlayer,
    songInfoPlayer,
    playPause,
    playBack,
    playForward,
    playProgress,
    playSoundMute,
    playVolume,
    playTimeStart,
    playSvgPath,
    playTimeEnd,
    registrationLink,
} from "./lib/domInit";

import { ApiInterface } from "./interfaces/ApiInterface";
import { PlayListItemInterface } from "./interfaces/PlayListInterface";
import { SettingsInterface, PlayerInterfaceInput } from "./interfaces/DefaultInterface";
import { PlayInterface } from "./interfaces/PlayInterface";

import { Play } from "./modules/PlayModule"
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("PLAY", root)
const config = {

    settings: settings
}
root.render(<BrowserRouter>
    <Routes>
        <Route path="/" element={<MainPage init={
            config
        } />} />
        <Route path="/play" element={<Play init={
            config
        } />} />
    </Routes>
</BrowserRouter>
);