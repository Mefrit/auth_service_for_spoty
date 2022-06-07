
import { useEffect, useState } from "react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { postJSON, getParams, getCurentUserInfo, getDataFromApi } from "../lib/query";
import {
    SettingsInterface,
    GetUserInfoInterface,
    PlayerInterfaceInput,
    DefaultRequest,
} from "../interfaces/DefaultInterface";
export function Auth(props: any) {
    const [errorMsg, setError] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        localStorage.removeItem("userInfo");

        const registration = async () => {
            const code = searchParams.get("code");
            console.log(localStorage.getItem("accessToken"));
            if (code && !localStorage.getItem("accessToken")) {
                localStorage.removeItem("timeSetAccessToken");
                localStorage.removeItem("accessToken");
                const answer = await postJSON("/", {
                    code: code,
                })
                if (answer.result && answer.accessToken) {
                    const parsedToken = JSON.parse(answer.accessToken);
                    if (parsedToken.error) {
                        setError("ERROR =>" + parsedToken.error_description);
                    } else {
                        localStorage.setItem("accessToken", parsedToken.access_token);

                        localStorage.setItem("timeSetAccessToken", new Date().getTime().toString());

                        const userInfo: GetUserInfoInterface = await getCurentUserInfo(parsedToken.access_token);
                        if (userInfo.result && userInfo.user) {
                            // localStorage.setItem("userInfo", JSON.stringify(userInfo.user));
                            console.log("userInfo.user", userInfo.user)
                            setName(userInfo.user.dispname);
                            setImage(userInfo.user.image);
                            setError("")

                        } else {
                            setError(userInfo.message ? userInfo.message + "222222222222" : "(");
                        }
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
                        localStorage.removeItem("userInfo");
                    } else {
                        const tokenFromStorage = localStorage.getItem("accessToken");
                        if (tokenFromStorage) {

                            getCurentUserInfo(tokenFromStorage).then((userInfo: GetUserInfoInterface) => {
                                if (userInfo.result) {
                                    // localStorage.setItem("userInfo", JSON.stringify(userInfo.user));


                                    setError("")
                                    setName(userInfo.user.dispname);
                                    setImage(userInfo.user.image);

                                } else {
                                    setError("Error: " + userInfo.message);
                                }
                            });
                        }
                    }
                }
            }
        }
        registration();
        // localStorage.removeItem("accessToken");
    })

    useEffect(() => { }, [errorMsg, name, image])
    const clearStorage = (ev) => {
        ev.preventDefault();

        localStorage.removeItem("timeSetAccessToken");
        localStorage.removeItem("accessToken");

        window.location = ev.target.href;
    }
    function getTemplateForUserInfo(image: string, name: string) {
        return <div className="user-info">
            <img src={image} alt="image_profile" />
            <span>{name}</span>
        </div>;
    }
    return <div className="user-info-content" id="user-info">
        <div className="registration-link" id="registration">
            {name ? getTemplateForUserInfo(image, name) :
                <a onClick={clearStorage} href={`https://api.jamendo.com/v3.0/oauth/authorize?client_id=${props.clientId}&redirect_uri=http://localhost:4567/&response_type=code`} >Вход</a>
            }
            {errorMsg === "" ? "" : <p>{errorMsg}</p>}
        </div>
    </div>
}