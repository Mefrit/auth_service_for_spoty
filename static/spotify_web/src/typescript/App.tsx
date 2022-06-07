import { postJSON, getParams, getCurentUserInfo, getDataFromApi } from "./lib/query";
import { PlayList } from "./modules/PlayList";
import { AudioPlayer } from "./modules/AudioPlayer";
import { Api } from "./modules/Api";
import { settings } from "./settings";
import { Play } from "./modules/PlayModule"
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
    userInfoDom,
    playsBtn,
    albumsContent,
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

import {
    SettingsInterface,
    GetUserInfoInterface,
    PlayerInterfaceInput,
    DefaultRequest,
} from "./interfaces/DefaultInterface";
import { MainPageInterface } from "./interfaces/MainPageInterface";
import { useEffect, useState } from "react";
import { MainPage } from "./modules/MainPage"
let tokenInfo: { accessToken: string } = { accessToken: "" };

function getTemplateForUserInfo(userInfo: { image: string; dispname: string }) {
    return <div className="user-info">
        <img src={userInfo.image} alt="image_profile" />
        <span>{userInfo.dispname}</span>
    </div>;
}
// / const urlParams = getParams(window.location);

// if (urlParams.code && !tokenInfo.accessToken && !localStorage.getItem("accessToken")) {
//     postJSON("/", {
//         code: urlParams.code,
//     }).then(async (answer) => {
//         // if (answer.result && answer.accessToken) {
//         //     const parsedToken = JSON.parse(answer.accessToken);
//         //     if (parsedToken.error) {
//         //         alert("ERROR =>" + parsedToken.error_description);
//         //     } else {
//         //         registrationLink.style.display = "none";
//         //         localStorage.setItem("accessToken", parsedToken.access_token);

//         //         localStorage.setItem("timeSetAccessToken", new Date().getTime().toString());
//         //         tokenInfo = parsedToken.access_token;
//         //         const userInfo: GetUserInfoInterface = await getCurentUserInfo(parsedToken.access_token);

//         //         if (userInfoDom && userInfo.result && userInfo.user) {
//         //             localStorage.setItem("id_user", userInfo.user?.id);
//         //             const userInfoContent = getTemplateForUserInfo(userInfo.user);
//         //             userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
//         //         } else {
//         //             alert(userInfo.message);
//         //         }
//         //     }
//         // }
//     });
// } else {
//     if (localStorage.getItem("accessToken") !== "undefined") {
//         // const timeSetAccessToken = Number(localStorage.getItem("timeSetAccessToken"));
//         // const dateSetToken: Date = new Date(timeSetAccessToken);
//         // const curentDate: Date = new Date();
//         // if (curentDate.getTime() - dateSetToken.getTime() > settings.TIME_TO_BLOCK) {
//         //     localStorage.removeItem("timeSetAccessToken");
//         //     localStorage.removeItem("accessToken");
//         // } else {
//         //     const tokenFromStorage = localStorage.getItem("accessToken");
//         //     if (tokenFromStorage) {
//         //         tokenInfo = { accessToken: tokenFromStorage };
//         //         getCurentUserInfo(tokenInfo.accessToken).then((userInfo: GetUserInfoInterface) => {
//         //             if (userInfo.result) {
//         //                 localStorage.setItem("id_user", userInfo.user.id);
//         //                 registrationLink.style.display = "none";
//         //                 if (userInfoDom) {
//         //                     const userInfoContent = getTemplateForUserInfo(userInfo.user);
//         //                     userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
//         //                 } else {
//         //                     alert("Error: " + userInfo.message);
//         //                 }
//         //             } else {
//         //                 alert(userInfo.message);
//         //             }
//         //         });
//         //     }
//         // }
//     }
// }

// const ApiObject = new Api();
// const player = new AudioPlayer({
//     audioPlayer: audioPlayer,
//     api: ApiObject,
//     settings: settings,
//     songInfoPlayer: songInfoPlayer,
//     playPause: playPause,
//     playBack: playBack,
//     playForward: playForward,
//     playProgress: playProgress,
//     playVolume: playVolume,
//     playSoundMute: playSoundMute,
//     timeStart: playTimeStart,
//     timeEnd: playTimeEnd,
//     playSvgPath: playSvgPath,
// });
// const main = new MainPage({
//     userInfoDom: userInfoDom,
//     albumsContent: albumsContent,
//     player: player,
//     settings: settings,
//     songInfoPlayer: songInfoPlayer,
//     registrationLink: registrationLink,
//     playsBtn: playsBtn,
// });
// main.start();

const config = {

    settings: settings
}
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("MAIN111111111111");
root.render(<BrowserRouter>
    <Routes>
        <Route path="/" element={
            <MainPage init={
                config
            } />}
        />
        <Route path="/play" element={<Play init={
            config
        } />} />
    </Routes>
</BrowserRouter>
);
