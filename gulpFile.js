var gulp = require("gulp"),
    logs = require("fancy-log"),
    coffee=require("gulp-coffee"),
    browserify=require("gulp-browserify"),
    compass=require("gulp-compass"),
    uglify=require("gulp-uglify"),
    gulpif=require("gulp-if"),
    minifyHtml=require("gulp-minify-html"),
    jsonMinify=require("gulp-jsonminify"),
    concat=require("gulp-concat");
    
var env,
    coffeeSources,
    jsSources,
    outputDir,
    sassStyle,
    htmlSources,
    sassSources;
    
env= process.env.NODE_ENV || "development"; 
if(env==="development"){
outputDir="builds/development/";
sassStyle="expanded";
}else{
outputDir="builds/production/";
sassStyle="compact";
}
coffeeSources=["components/coffee/tagline.coffee"];
jsSources=[
    "components/scripts/rclick.js",
    "components/scripts/pixgrid.js",
    "components/scripts/tagline.js",
    "components/scripts/template.js"
];
htmlSources=["builds/development/*.html"];
sassSources=["components/sass/style.scss"];

gulp.task("coffee", function(){
gulp.src(coffeeSources)
    .pipe(coffee({bare:true})
        .on("error",logs))
    .pipe(gulp.dest("components/scripts"))
});

gulp.task("js", function(){
gulp.src(jsSources)
    .pipe(concat("script.js"))
    .pipe(browserify())
    .pipe(gulpif(env==="production",uglify()))
    .pipe(gulp.dest(outputDir +"js"))
});

gulp.task("compass", function(){
gulp.src(sassSources)
    .pipe(compass({
        css:outputDir+"css",
    sass:"components/sass",
    image:"images",
    style:sassStyle
    }))
    logs(sassStyle);
});

gulp.task("html",function(){
    gulp.src(htmlSources)
        .pipe(gulpif(env==="production", minifyHtml()))
        .pipe(gulpif(env==="production",gulp.dest(outputDir))) 
})
gulp.task("json",function(){
    gulp.src("builds/development/js/*.json")
        .pipe(gulpif(env==="production", jsonMinify()))
        .pipe(gulpif(env==="production",gulp.dest(outputDir+"js"))) 
})
gulp.task("watch",function(){
    gulp.watch(coffeeSources,["coffee"])
    gulp.watch(jsSources,["js"])
    gulp.watch("components/sass/*.scss",["compass"])
    gulp.watch(htmlSources,["html"])
    gulp.watch("builds/development/js/*.json",["json"])
})
gulp.task("default",["coffee", "js", "compass", "html", "json", "watch"]);