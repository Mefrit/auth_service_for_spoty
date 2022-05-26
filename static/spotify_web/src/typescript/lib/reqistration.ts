import { settings } from "../settings";

import { getCurentUserInfo } from "./query";
import { GetUserInfoInterface } from "../interfaces/DefaultInterface";
export function getTemplateForUserInfo(userInfo: { image: string; dispname: string }) {
    return `
        <div class="user-info">
            <img src="${userInfo.image}"alt="image_profile">
            <span>${userInfo.dispname}</span>
        </div>
    `;
}
export function setUserInfoFromStorage(userInfoDom: HTMLElement, registrationLink: HTMLElement) {
    const timeSetAccessToken = Number(localStorage.getItem("timeSetAccessToken"));
    const dateSetToken: Date = new Date(timeSetAccessToken);
    const curentDate: Date = new Date();

    if (curentDate.getTime() - dateSetToken.getTime() > settings.TIME_TO_BLOCK) {
        localStorage.removeItem("timeSetAccessToken");
        localStorage.removeItem("accessToken");
    } else {
        const tokenFromStorage = localStorage.getItem("accessToken");
        if (tokenFromStorage) {
            let tokenInfo = { accessToken: tokenFromStorage };
            console.log("start", tokenInfo);
            getCurentUserInfo(tokenInfo.accessToken).then((userInfo: GetUserInfoInterface) => {
                console.log(userInfo);
                if (userInfo.result) {
                    localStorage.setItem("id_user", userInfo.user.id);
                    registrationLink.style.display = "none";
                    console.log(userInfoDom);
                    if (userInfoDom) {
                        const userInfoContent = getTemplateForUserInfo(userInfo.user);
                        userInfoDom.insertAdjacentHTML("beforeend", userInfoContent);
                    } else {
                        alert("Error: " + userInfo.message);
                    }
                } else {
                    alert(userInfo.message);
                }
            });
        }
    }
}
