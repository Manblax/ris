'use strict';
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  minify = require('gulp-csso'),
  cssnano = require('gulp-cssnano'),
  notify = require('gulp-notify'),
  svgstore = require('gulp-svgstore'),
  imagemin = require('gulp-imagemin'),
  tinypng = require('gulp-tinypng'),
  cache = require('gulp-cache'),
  rename = require('gulp-rename'),
  del = require('del'),
  nunjucks = require('gulp-nunjucks');

gulp.task('css', function () {
  return gulp.src('source/css/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: true
    }))
    .on("error", notify.onError({
      title: "style"
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
  return gulp.src('source/**/*.html')
    .pipe(nunjucks.compile({name: 'Sindre'}))
    .pipe(gulp.dest('build'))
    .on('end', browserSync.reload);

});

gulp.task('js', function () {
  return gulp.src('source/js/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function () {
  gulp.watch('source/css/**/*.css', gulp.series('css'));
  gulp.watch('source/**/*.html', gulp.series('html'));
  gulp.watch('source/*.php');
  gulp.watch('source/js/**/*.js', gulp.series('js'));
  gulp.watch('source/img/*', gulp.series('image', 'svg'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task('image', function () {
  return gulp.src('source/img/**/*.{png,jpg,gif,jpeg}')
    .pipe(gulp.dest('build/img'));
});

gulp.task('clearCache', function () {
  return cache.clearAll();
});

gulp.task('image_build', function () {
  return gulp.src(['source/img/**/*.{png,jpg,gif,jpeg}'], {base: 'source'})
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3})
    ])))
    .pipe(tinypng('xPZg3TMpYb60z199PpxJ1Ds2W0QdjBC7'))
    .pipe(gulp.dest(['build']));
});

gulp.task('sprite', function () {
  return gulp.src('source/img/**/*.svg')

    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/icons'));
});

gulp.task('svg', function () {
  return gulp.src(['source/img/**/*.svg'], {base: 'source'})
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3})
    ])))
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('copy', function () {
  return gulp.src(
    ['source/fonts/**/*'],
    {base: 'source'})
    .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series(
  gulp.parallel('html', 'css', 'js'),
  gulp.parallel('watch', 'serve')
));

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('html', 'copy', 'svg', 'css', 'js', 'image_build'),
  gulp.parallel('watch', 'serve')
));

