export function postJSON(url: string, args: any) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ ...args }),
        }).then((data) => {
            try {
                const parsed = data.json();
                resolve(parsed);
            } catch (err: any) {
                resolve({ result: false, message: err.toString() });
            }
        });
    });
}

export async function getJSON(url: string) {
    return new Promise((resolve, reject) => {
        return fetch(url).then((data: any) => {
            try {
                const parsed = data.json();
                resolve(parsed);
            } catch (err: any) {
                resolve({ result: false, message: err.toString() });
            }
        });
    });
}
export function getParams(url = window.location) {
    let params: any = {};
    const url_str = url.toString();
    new URL(url_str).searchParams.forEach(function (val, key) {
        params[key] = val; // Пушим пары ключ / значение (key / value) в объект
    });
    return params;
}
