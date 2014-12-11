'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var sass = require('gulp-sass');

var inject = require("gulp-inject");
var minifyCss = require('gulp-minify-css');
var minifyHtml = require("gulp-minify-html");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var jshint = require("gulp-jshint");
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


// task CSS/SCSS
gulp.task('sass', function() {
  gulp.src('./app/styles/scss/*.scss')
  .pipe(sass({ 
    noCache : true,
    style   : "compact"
  }))
  // .pipe(sass())
  .pipe(gulp.dest('./app/styles'))
});

// task JS 
gulp.task('js', function () {
    gulp.src('./app/scripts/*.js') // path to your files
    //.pipe(jshint())
    //.pipe(jshint.reporter('fail')) // make sure the task fails if not compliant
    // .pipe(concat('app.js'))  // concat and name it "concat.js"
    // .pipe(uglify())
    // .pipe(gulp.dest('./dist/js'));
  });

gulp.task('watch', function() {
  gulp.watch('app/styles/scss/*.scss', ['sass']);
  gulp.watch('app/styles/css/*.css', reload);

});

gulp.task('default', ['sass', 'js', 'watch'], function () {
  browserSync({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app']
  });

  gulp.watch(['./app/**/*.html'], reload);
  gulp.watch(['./app/styles/main.css'], ['sass', reload]);
  gulp.watch(['./app/styles/**/*.{scss,css}'], ['sass', reload]);
  gulp.watch(['./app/images/**/*'], reload);
});
