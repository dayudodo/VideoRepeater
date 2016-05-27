var path = require("path");  
var gulp = require('gulp');  
var livereload = require('gulp-livereload');  
var run = require('gulp-run');  
var less = require('gulp-less');  
var babel = require('gulp-babel');

var lessOptions = {  
    relativeUrls: true
};
var babelOptions = {  
    whitelist: ['react', 'strict', 'es6.destructuring']
};

gulp.task("default", ["server"]);  
gulp.task("watch", ["server"]);  
gulp.task("start", ["server"]);  
gulp.task("server", ["babel_demo", "less_demo"], function (callback) {  
    livereload.listen();

    run('electron .').exec();

    gulp.watch(['public/**/*.jsx', 'index.jsx'], function (event) {
        if (event.type === 'deleted') return;

        gulp.src(event.path)
            .pipe(babel(babelOptions))
            .pipe(gulp.dest(path.dirname(event.path)));
    });

    gulp.watch(['public/**/*.js', './*.html']).on('change', livereload.reload);

    gulp.watch(['public/**/*.less'], ['reload_by_css']);

    callback();
});

gulp.task('less_demo', function (callback) {  
    gulp.src(['public/app/*.less'])
        .pipe(less(lessOptions))
        .pipe(gulp.dest('public/app'));
    callback();
});

gulp.task('babel_demo', function (callback) {  
    gulp.src('public/**/*.jsx').pipe(babel(babelOptions)).pipe(gulp.dest('public'));
    gulp.src('index.jsx').pipe(babel(babelOptions)).pipe(gulp.dest('.'));
    callback();
});

gulp.task('reload_by_css', function (callback) {  
    gulp.src(['public/app/*.less'])
        .pipe(less(lessOptions))
        .pipe(gulp.dest('public/app'))
        .pipe(livereload());
    callback();
});