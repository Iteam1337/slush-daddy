var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha-phantomjs'),
  karma = require('gulp-karma'),
  connect = require('gulp-connect'),
  fs = require('fs'),
  path = require('path'),
  projectFiles = require('./projectFiles'),
  _ = require('lodash');

var config = require('./config.json');

var runningServer;
var taskNames = {};
var runningTasks = {};

function _lint(name) {
  taskNames.lint = name;
  gulp.task(name, function() {
    runningTasks.lint = true;

    return gulp.src(config.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });
}

function serveTests() {
  if(!runningServer) {
    runningServer = true;

    return connect.server({
      port: config.mochaPort,
      root: process.cwd(),
      middleware: function(app, opts) {
        return [
          function(req, res, next) {
            if (req.url === '/') {
              fs.readFile(path.join(__dirname, config.mochaFile), {
                encoding: 'utf-8'
              }, function(err, body) {
                if (err) {
                  return res.end(err.toString());
                }
                var data = projectFiles({includeDev: true, code: config.code, tests: config.tests});
                return res.end(_.template(body)(data));
              });
            } else {
              return next();
            }
          }
        ];
      }
    });
  }
}

function _mocha(name) {
  taskNames.mocha = name;
  gulp.task(name, function() {
    runningTasks.mocha = true;
    serveTests();

    var stream = mocha();
    stream.write({
      path: 'http://localhost:' + config.mochaPort + '/'
    });
    stream.end();

    stream.on('end', function() {
      if (!runningTasks.watching) {
        connect.serverClose();
      }
    });

    return stream;
  });
}

function _karma(name) {
  taskNames.karma = name;
  var isWatching = process.argv.indexOf('watch') > -1;
  gulp.task(name, function() {
    var options = {
      frameworks: ['mocha', 'sinon-chai'],
      reporters: ['progress'],
      port: config.karmaPort,
      colors: true,
      browsers: config.karmaBrowsers,
      action: (isWatching) ? 'watch' : 'run'
    };
    runningTasks.karma = true;
    var files = projectFiles.bowerDependencies(true).concat([
      'src/**/*.module.js',
      'src/**/*.js',

      'test/**/*.js'
    ]);
    var task = gulp.src(files).pipe(karma(options));
    if(isWatching) {
      task = task.on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero 
        throw err;
      });
    }

    return task;
  });
}

function _watch() {
  if(runningTasks.watching) { return; }

  runningTasks.watching = true;
  if(runningTasks.lint) { gulp.watch(config.js, [taskNames.lint]); }
  if(runningTasks.mocha) { gulp.watch(config.code.concat(config.tests), [taskNames.mocha]); }
}

module.exports = {
  lint: _lint,
  mocha: _mocha,
  karma: _karma,
  watch: _watch
};