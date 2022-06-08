
import { settings } from "./settings";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom";

import { MainPage } from "./App"


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