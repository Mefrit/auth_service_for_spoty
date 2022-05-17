module.exports = {
    source: {
        styles: "src/style/less/**/[^_]*.less",
        ts: ["src/scripts/typescript/**/*.{ts,tsx}", "node_modules/@types/{react,react-dom,requirejs}/*.d.ts"], //
    },
    output: {
        css: "public/style/css/",

        js: "public/script/js/",
    },
};
