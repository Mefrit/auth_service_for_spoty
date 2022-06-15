import { settings } from "./settings";
import { Play } from "./modules/PlayModule"
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";
import { MainPage } from "./modules/MainPage"

const config = {
    settings: settings
}
const root = ReactDOM.createRoot(document.getElementById("root"));
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
