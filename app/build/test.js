var jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha-phantomjs'),
    connect = require('gulp-connect'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

var js = ['**/*.js', '!node_modules/**/*.js', '!bower_components/**/*.js'];
var code = ['src/**/*.js'];
var tests = ['test/**/*.js'];

var testServer;

function lint(gulp, name) {
    gulp.task(name, function () {
        gulp.activeTasks = gulp.activeTasks || {};
        gulp.activeTasks.lint = name;

        return gulp.src(js)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });
}

function serveTests() {
    if(!testServer) {
        testServer = connect.server({
            port: 1337,
            root: process.cwd(),
            middleware: function (app, opts) {
                return [
                    function (req, res, next) {
                        if (req.url === '/') {
                            fs.readFile(path.join(__dirname, 'test.html'), {encoding: 'utf-8'}, function (err, body) {
                                if (err) {
                                    return res.end(err.toString());
                                }
                                var data = {
                                    dependencies: [],
                                    code: [],
                                    tests: []
                                };
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
    return testServer;
}

function test(gulp, name) {
    gulp.activeTasks = gulp.activeTasks || {};
    gulp.activeTasks.tests = name;

    gulp.task(name, function () {
        serveTests();

        var stream = mocha();
        stream.write({path: 'http://localhost:1337/'});
        stream.end();

        stream.on('end', function () {
            if(!gulp.activeTasks.watching) {
                connect.serverClose();
            }
        })

        return stream;
    });
}

function watch(gulp) {
    gulp.activeTasks = gulp.activeTasks || {};

    gulp.activeTasks.watching = true;
    if(gulp.activeTasks.lint) {
        gulp.watch(js, [gulp.activeTasks.lint]);
    }
    if(gulp.activeTasks.tests) {
        gulp.watch(code.concat(tests), [gulp.activeTasks.tests]);
    }
}

module.exports = {
    lint: lint,
    test: test,
    watch: watch
};