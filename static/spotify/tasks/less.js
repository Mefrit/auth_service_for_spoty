const gulp = require("gulp");

const less = require("gulp-less");
const path = require("path");
const config = require("./config");

exports.fn = () => {
    return gulp
        .src(config.source.styles)
        .pipe(
            less({
                paths: [path.join(__dirname, "includes")],
            })
        )
        .pipe(gulp.dest(config.output.css));
};
