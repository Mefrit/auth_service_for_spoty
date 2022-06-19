import { DefaultRequest, DefaultJumendoRequest, GetUserInfoInterface } from "../interfaces/DefaultInterface";

export function postJSON(
    url: string,
    args: unknown
): Promise<{ accessToken?: string; result?: boolean; message?: unknown }> {
    return new Promise(async (resolve, reject) => {
        function getData() {
            return new Promise((resolve, reject) => {
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(args),
                }).then(async (data) => {
                    function parseJson() {
                        const parsed = data.json();
                        return parsed;
                    }

                    resolve(await errorDecorator(parseJson));
                });
            });
        }
        resolve(errorDecorator(getData));
    });
}
async function errorDecorator(f: any) {
    try {
        return await f();
    } catch (error: unknown) {
        return { result: false, message: error };
    }
}
export async function getJSON(url: string): Promise<DefaultJumendoRequest> {
    return new Promise((resolve, reject) => {
        function getData() {
            return new Promise((resolve, reject) => {
                fetch(url).then(async (data) => {
                    function parseJson() {
                        const parsed = data.json();
                        return parsed;
                    }

                    resolve(await errorDecorator(parseJson));
                });
            });
        }
        resolve(errorDecorator(getData));
    });
}
export function getParams(url = window.location) {
    let params: {
        [key: string]: string;
    } = {};
    const urlStr = url.toString();
    new URL(urlStr).searchParams.forEach(function (val: string, key: string) {
        params[key] = val; // Пушим пары ключ / значение (key / value) в объект
    });
    return params;
}
export async function getCurentUserInfo(accessToken: string): Promise<GetUserInfoInterface> {
    return new Promise((resolve, reject) => {
        const url =
            "https://api.jamendo.com/v3.0/users/?client_id=cf25482b&format=jsonpretty&access_token=" + accessToken;
        getJSON(url).then((data: DefaultJumendoRequest) => {
            if (data.headers.status === "success" && data.results) {
                const result: { image: string; dispname: string; id: string } = data.results[0];
                resolve({ result: true, user: result });
            } else {
                resolve({
                    result: false,
                    message: data.headers.error_message,
                    user: { image: "", dispname: "", id: "" },
                });
            }
        });
    });
}
export async function getDataFromApi(url: string): Promise<DefaultRequest> {
    return new Promise((resolve, reject) => {
        getJSON(url).then((data: DefaultJumendoRequest) => {
            if (data.headers.status === "success") {
                resolve({ result: true, data: data.results });
            } else {
                resolve({ result: false, message: data.headers.error_message, data: {} });
            }
        });
    });
}
