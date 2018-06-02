var gulp = require("gulp"),
    logs = require("fancy-log"),
    coffee=require("gulp-coffee");
var coffeeSources=["components/coffee/tagline.coffee"]
gulp.task("coffee", function(){
gulp.src(coffeeSources)
    .pipe(coffee({bare:true})
        .on("error",logs))
    .pipe(gulp.dest("components/scripts"))
})
