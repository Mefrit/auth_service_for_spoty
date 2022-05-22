const gulp = require("gulp");

const config = require("./config");

exports.fn = gulp.series([
    "less",
    () => {
        gulp.watch(config.source.styles, gulp.series(["less"]));
        gulp.watch(config.source.ts, gulp.series(["script"]));
    },
]);
