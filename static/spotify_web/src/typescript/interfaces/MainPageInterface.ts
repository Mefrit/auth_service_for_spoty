import { PlayListItemJumendoInterface } from "./PlayListInterface";
export interface playListInterface {
    list: PlayListItemJumendoInterface[];
    title: string;
    type: string;
    url: string;
}
export interface MainPageProps {
    init: {
        settings: {
            API_BASE: string;
            API_KEY: string;
            CLIENT_ID: string;
            CODE: string;
            SECRET: string;
            TIME_TO_BLOCK: number;
        };
    };
}
