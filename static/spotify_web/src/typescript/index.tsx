import React from 'react';
import ReactDOM from 'react-dom';
// import './style/css/main.css';
// import App from './typescript/App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//

//
import { Play } from "./modules/PlayModule"

import { Search } from "./modules/Search"
import { MainPage } from "./modules/MainPage"
import { settings } from "./settings";

const config = {
    settings
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPage init={
                config
            } />} />
            <Route path="/play" element={<Play init={
                config
            } />} />

            <Route path="/search" element={<Search init={
                config
            } />} />
        </Routes>
    </BrowserRouter>
);
