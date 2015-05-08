'use strict';

var path = require('path'),
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    less = require('gulp-less'),
    del = require('del'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    RevAll = require('gulp-rev-all'),
    runSequence = require('run-sequence'),
    cssmin = require('gulp-minify-css'),
    webpack = require('gulp-webpack-build');

var config = require('./config.json');

gulp.task('webpack', function() {
    return gulp.src('./webpack.config.js')
    .pipe(webpack.compile({
            debug: true
        }))
        .pipe(webpack.format({
            version: true,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(replace(/@@static/g, config.static))
        .pipe(gulp.dest('.'));
});

gulp.task('webpack:build', function(){
    return gulp.src('./webpack.config.production.js')
    .pipe(webpack.compile({
            isConfigFile: function(file){return true;}
        }))
        .pipe(webpack.format({
            version: false,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: false
        }))
        .pipe(replace(/@@static/g, config.static))
        .pipe(gulp.dest('.'));
});


gulp.task("release", ["clean"], function(){
    runSequence('webpack:build','images','less', 'html', 'rev');
});

gulp.task('clean', del.bind(null, ['.tmp', 'build/*'], {dot: true}));

gulp.task("images", function(){
    gulp.src(['img/**/*.png', 'img/**/*.svg', 'img/**/*.jpg'])
    .pipe(gulp.dest('build' + config.static + '/img'));
});

gulp.task('default', ['webpack', 'less', 'html', 'images', 'fonts'], function(){
    browserSync({
        notify: false,
        proxy: 'http://localhost:8282'
    }); 

    gulp.watch('less/**/*.less', ['less', reload]);
    gulp.watch(['js/**/*.jsx', 'js/**/*.js'], ['webpack', reload]);
    gulp.watch('index.html', ['html', reload]);
});

gulp.task('rev', function(){
    var revAll = new RevAll({ 
        dontRenameFile: [/^\/favicon.ico$/g, /^\/index.html/g]
    });

  return gulp.src(['build/**'])
    .pipe(gulp.dest('build'))
    .pipe(revAll.revision())
    .pipe(gulp.dest('build'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('build'));
});

gulp.task('less', function(){
    return gulp.src('less/app.less')
        .pipe(less())
        .pipe(replace(/@@static/g, config.static))
        .pipe(cssmin())
        .pipe(gulp.dest('build' + config.static + '/css'));
});

gulp.task('fonts', function(){
    return gulp.src('fonts/**/*')
        .pipe(gulp.dest('build' + config.static + '/fonts'));
});

gulp.task('html', function(){
   return gulp.src('index.html')
        .pipe(replace(/@@static/g, config.static))
        .pipe(gulp.dest('build'));
});
