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
  template = require('gulp-template'),
  path = require('path'),
  projectFiles = require('./projectFiles'),
  serve = require('./serve');

var config = require('./config.json');

var taskNames = {};
var runningTasks = {};

function _assets(name) {
  taskNames.assets = name;
  gulp.task(name, function () {
    runningTasks.assets = true;
    gulp.src(config.assetFiles)
      .pipe(gulp.dest(config.distFolder));
  });
}

function _build(name) {
  taskNames.build = name;
  gulp.task(name, function (cb) {
    runningTasks.build = true;
    runningTasks.assets = true;
    runningTasks.html = true;
    runningTasks.less = !!taskNames.less;
    runningTasks.sass = !!taskNames.sass;
    runningTasks.templatecache = true;
    runningTasks.concat = true;
    runningTasks.manifest = !!taskNames.manifest;

    var sequence = [
      taskNames.clean, [
        taskNames.html,
        taskNames.less || taskNames.sass,
        taskNames.templatecache
      ], [
        taskNames.concat,
        taskNames.assets
      ]
    ];
    if(runningTasks.manifest) {
      sequence.push(taskNames.manifest);
    }
    sequence.push(function () { cb(); });

    runSequence.apply(runSequence, sequence);
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
    return gulp.src(projectFiles.bowerDependencies().concat(config.code))
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

function _html(name) {
  taskNames.html = name;
  gulp.task(name, function () {
    runningTasks.html = true;
    return gulp.src(config.indexFile)
      .pipe(template({
        css: config.appName + '.css',
        code: [config.appName + '.js'],
        dependencies: false,
        manifest: runningTasks.manifest ? config.appName + '.manifest' : false,
        livereload: false
      }))
      .pipe(minifyHtml({
        quotes: true,
        empty: true
      }))
      .pipe(gulp.dest(config.distFolder));
  });
}

function _manifest(name) {
  taskNames.manifest = name;
  gulp.task(name, function () {
    runningTasks.manifest = true;
    gulp.src([config.distFolder + '/**/*'])
      .pipe(manifest({
        hash: true,
        preferOnline: true,
        network: ['http://*', 'https://*', '*'],
        filename: config.appName + '.manifest',
        exclude: config.appName + '.manifest'
       }))
      .pipe(gulp.dest(config.distFolder));
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
          file: path.join(process.cwd(), config.indexFile),
          assets: {
            includeDev: false,
            code: config.code,
            css: config.tmpFolder + '/' + config.appName + '.css',
            livereload: livereload,
            manifest: false
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
  if(runningTasks.assets) {
    gulp.watch(config.assetFiles, [taskNames.assets]);
  }
  if(runningTasks.html) {
    gulp.watch(config.indexFile, [taskNames.html]);
  }
  if(runningTasks.manifest) {
    var dist = [
      config.distFolder + '/*',
      '!' + config.distFolder + '/' + config.appName + '.manifest'
    ];
    console.log('watching manifest', dist);
    gulp.watch(dist, [taskNames.manifest]);
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
  assets: _assets,
  build: _build,
  clean: _clean,
  concat: _concat,
  html: _html,
  less: _less,
  manifest: _manifest,
  sass: _sass,
  templatecache: _templatecache,
  serve: _serve,
  watch: _watch
};