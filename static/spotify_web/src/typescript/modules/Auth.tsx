
import { useEffect, useState } from "react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { postJSON, getCurentUserInfo } from "../lib/query";
import {
    GetUserInfoInterface,
} from "../interfaces/DefaultInterface";

export function Auth(props: { clientId: string, timeBlock: number }) {
    const [authData, setAuthData] = useState({
        errorMsg: "",
        name: "",
        image: ""
    });
    const [searchParams] = useSearchParams();
    async function setUserInfo(access_token: string) {
        const userInfo: GetUserInfoInterface = await getCurentUserInfo(access_token);
        localStorage.setItem("idUser", userInfo.user.id);
        if (userInfo.result && userInfo.user) {
            setAuthData({
                errorMsg: "",
                name: userInfo.user.dispname,
                image: userInfo.user.image
            })
        } else {
            setAuthData({
                errorMsg: userInfo.message ? userInfo.message : "",
                name: "",
                image: ""
            })
        }
    }
    useEffect(() => {
        localStorage.removeItem("userInfo");
        const registration = async () => {
            const code = searchParams.get("code");
            if (code && !localStorage.getItem("accessToken")) {
                localStorage.removeItem("timeSetAccessToken");
                localStorage.removeItem("accessToken");
                const answer = await postJSON("/", {
                    code
                })
                if (answer.result && answer.accessToken) {
                    const parsedToken = JSON.parse(answer.accessToken);
                    if (parsedToken.error) {
                        setAuthData({
                            errorMsg: parsedToken.error_description,
                            name: "",
                            image: ""
                        })
                    } else {
                        localStorage.setItem("accessToken", parsedToken.access_token);
                        localStorage.setItem("timeSetAccessToken", new Date().getTime().toString());
                        setUserInfo(parsedToken.access_token);
                    }
                }
            } else {
                if (localStorage.getItem("accessToken") !== "undefined" && localStorage.getItem("accessToken")) {
                    const timeSetAccessToken = Number(localStorage.getItem("timeSetAccessToken"));
                    const dateSetToken: Date = new Date(timeSetAccessToken);
                    const curentDate: Date = new Date();
                    if (curentDate.getTime() - dateSetToken.getTime() > props.timeBlock) {
                        localStorage.removeItem("timeSetAccessToken");
                        localStorage.removeItem("accessToken");
                    } else {
                        const tokenFromStorage = localStorage.getItem("accessToken");
                        if (tokenFromStorage) {
                            setUserInfo(tokenFromStorage);
                        }
                    }
                }
            }
        }
        registration();
    },[])

    const clearStorage = (ev: Event) => {
        ev.preventDefault();
        localStorage.removeItem("timeSetAccessToken");
        localStorage.removeItem("accessToken");
        window.location = (ev.target as HTMLLinkElement).href;
    }
    function getTemplateForUserInfo(image: string, name: string) {
        return <div className="user-info">
            <img src={image} alt="image_profile" />
            <span>{name}</span>
        </div>;
    }
    return <div className="user-info-content" id="user-info">
        <div className="registration-link" id="registration">
            {authData.name ? getTemplateForUserInfo(authData.image, authData.name) :
                <a onClick={clearStorage} href={`https://api.jamendo.com/v3.0/oauth/authorize?client_id=${props.clientId}&redirect_uri=http://localhost:4567/&response_type=code`} >Вход</a>
            }
            {authData.errorMsg === "" ? "" : <p>{authData.errorMsg}</p>}
        </div>
    </div>
}