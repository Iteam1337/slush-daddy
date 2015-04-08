var gulp = require('gulp'),
  rimraf = require('gulp-rimraf'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  inject = require('gulp-inject'),
  less = require('gulp-less'),
  manifest = require('gulp-manifest'),
  minifyHtml = require('gulp-minify-html'),
  rename = require('gulp-rename'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  templatecache = require('gulp-angular-templatecache'),
  path = require('path'),
  serve = require('./serve');

var config = require('./config.json');

var taskNames = {};
var runningTasks = {};

function _build(name) {
  taskNames.build = name;
  gulp.task(name, function (cb) {
    runningTasks.build = true;
    runningTasks.less = !!taskNames.less;
    runningTasks.sass = !!taskNames.sass;
    runningTasks.templatecache = true;
    runningTasks.concat = true;

    runSequence(taskNames.clean, [
      taskNames.less || taskNames.sass,
      taskNames.templatecache
    ], taskNames.concat, function () {
      cb();
    });
  });
}

function _clean(name) {
  taskNames.clean = name;
  gulp.task(name, function () {
    runningTasks.clean = true;
    return gulp.src([config.distFolder, 'src/tmp'], {read: false})
      .pipe(rimraf());
  });
}

function _concat(name) {
  taskNames.concat = name;
  gulp.task(name, function () {
    runningTasks.concat = true;
    return gulp.src(config.code)
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat(config.appName + '.js'))
      .pipe(sourcemaps.write(config.sourcemapsFolder))
      .pipe(gulp.dest(config.distFolder));
  });
}

function _templatecache(name) {
  taskNames.templatecache = name;
  gulp.task(name, function () {
    runningTasks.templatecache = true;
    return gulp.src(config.templateFiles)
      .pipe(sourcemaps.init())
      .pipe(templatecache())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.tmpFolder));
  });
}

function _less(name) {
  taskNames.less = name;
  gulp.task(name, function () {
    runningTasks.less = true;
    return gulp.src(config.lessIndexFile)
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(rename(config.appName + '.css'))
      .pipe(sourcemaps.write(config.sourcemapsFolder))
      .pipe(gulp.dest(config.tmpFolder));
  });
}

function _sass(name) {
  taskNames.sass = name;
  gulp.task(name, function () {
    runningTasks.sass = true;
    return gulp.src(config.sassFiles)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(rename(config.appName + '.css'))
      .pipe(sourcemaps.write(config.sourcemapsFolder))
      .pipe(gulp.dest(config.tmpFolder));
  });
}

function _serve(name) {
  taskNames.serve = name;
  gulp.task(name,
    [taskNames.less || taskNames.sass, taskNames.templatecache],
    function () {
      var livereload = {port: config.serveLrPort};
      var connect = serve({
        port: config.servePort,
        root: process.cwd(),
        livereload: livereload
      }, {
        '/': {
          file: path.join(process.cwd(), 'src', 'index.html'),
          assets: {
            includeDev: false,
            code: config.code,
            css: config.tmpFolder + '/' + config.appName + '.css',
            livereload: livereload
          }
        }
      });
      runningTasks.serve = connect;
      _watch();
    });
}

function _watch() {
  /*jshint maxcomplexity:false */
  if(runningTasks.watching) { return; }
  runningTasks.watching = true;
  var task;

  if(runningTasks.less) {
    gulp.watch(config.lessFiles, [taskNames.less]);
  }
  if(runningTasks.sass) {
    task = gulp.watch(config.sassFiles, [taskNames.sass]);
  }
  if(runningTasks.templatecache) {
    task = gulp.watch(config.templateFiles, [taskNames.templatecache]);
  }
  if(runningTasks.concat) {
    gulp.watch(config.code, [taskNames.concat]);
  }
  if(runningTasks.serve) {
    gulp.watch(['src/**/*.js', 'src/**/*.css']).on('change', function (evt) {
      gulp
        .src(evt.path)
        .pipe(runningTasks.serve.reload());
    });
  }
}

module.exports = {
  build: _build,
  clean: _clean,
  concat: _concat,
  less: _less,
  sass: _sass,
  templatecache: _templatecache,
  serve: _serve,
  watch: _watch
};