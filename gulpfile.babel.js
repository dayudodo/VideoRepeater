var path = require("path");  
var gulp = require('gulp');  
var livereload = require('gulp-livereload');  
var run = require('gulp-run');  
var less = require('gulp-less'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js');

var lessOptions = {  
    relativeUrls: true
};

gulp.task("default", ["server"]);  //当你直接gulp用的其实就是gulp default
gulp.task("watch", ["server"]);  //我是直接使用gulp watch,执行的也是server,内部还是可以server
gulp.task("start", ["server"]);  

gulp.task("server", ["webpack"], function (callback) {  
    livereload.listen();

    run('electron .').exec();

    gulp.watch([ 'app/**/*.es6', 'index.jsx'], function (event) {
        if (event.type === 'deleted') return;

        gulp.src(event.path)
            .pipe(gulp.dest(path.dirname(event.path)));
    });

    gulp.watch(['build/**/*.js', './*.html']).on('change', livereload.reload);

    gulp.watch(['app/**/*.less'], ['reload_by_css']);

    gulp.watch(['app/**/*.jsx'], ['webpack']);

    callback();
});

gulp.task('clean', function (callback) {
    gulp.src(['./build'], {read: false})
        .pipe(clean());
    callback();
});

gulp.task('webpack', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({ modules: false, colors: true, watch: true }));
        callback();
    });
});


gulp.task('reload_by_css', function (callback) {  
    gulp.src(['app/*.less'])
        .pipe(less(lessOptions))
        .pipe(gulp.dest('app/'))
        .pipe(livereload());
    callback();
});