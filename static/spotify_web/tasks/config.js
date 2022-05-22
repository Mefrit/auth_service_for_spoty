module.exports = {
    source: {
        styles: "src/style/less/**/[^_]*.less",
        ts: ["src/typescript/**/*.{ts,tsx}"], //
    },
    output: {
        css: "public/style/css/",
        js: "public/script/js/",
    },
};
