const gulp = require("gulp");

const tasks = ["script", "less", "watch"];

tasks.forEach((task) => {
    //    console.log('init task:', task);
    var t = require("./tasks/" + task);
    console.log(task);
    gulp.task(task, t.fn);
});
// css после завершения задачи запускает script
// haxe после завершения задачи запускает swf-copyw
gulp.task("default", gulp.series(["script", "less", "watch" /*, 'script'*/]));
gulp.task("build", gulp.series(["script", "less"]));
