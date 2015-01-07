'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var sass = require('gulp-sass');

var inject = require("gulp-inject");
var minifyCss = require('gulp-minify-css');
var minifyHtml = require("gulp-minify-html");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// task CSS/SCSS
gulp.task('sass', function() {
  gulp.src(['./styles/scss/*.scss', './styles/scss/**/*.scss'])
  .pipe(sass({
    noCache : true,
    style   : "compact"
  }))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./styles'))
});

// task JS 
gulp.task('js', function () {
  gulp.src('./scripts/*.js')
    // .pipe(concat('app.js'))
    // .pipe(uglify())
    // .pipe(gulp.dest('./dist/js'));
  });

// task watch
gulp.task('watch', function() {
  gulp.watch('styles/scss/*.scss', ['sass']);
  gulp.watch('styles/*.css', reload);

});

// task default
gulp.task('default', ['sass', 'js', 'watch'], function () {
  browserSync({
    notify: false,
    // https: true,
    server: ['.tmp', '']
  });

  gulp.watch(['./**/*.html'], reload);
  gulp.watch(['./styles/style.css'], ['sass', reload]);
  gulp.watch(['./styles/**/*.{scss,css}'], ['sass', reload]);
  gulp.watch(['./images/**/*'], reload);
});
