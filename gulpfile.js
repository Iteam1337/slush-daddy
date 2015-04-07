var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    runSequence = require('run-sequence');

gulp.task('jshint', function () {
    return gulp.src([
        '**/*.js',
        '!templates/**/*.js',
        '!test/integration/expected/**/*.js',
        '!test/integration/generated/**/*.js',
        '!node_modules/**/*.js',
        '!bower_components/**/*.js',
        '!app/node_modules/**/*.js',
        '!app/bower_components/**/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('unit', function () {
    return gulp.src(['test/unit/**/*.spec.js'])
        .pipe(mocha({reporter:'spec'}));
});

gulp.task('integration', function () {
    return gulp.src(['test/integration/**/*.spec.js', '!test/integration/expected/**/*.js'])
        .pipe(mocha({reporter:'spec'}));
});

gulp.task('test', function (cb) {
    return runSequence('jshint', 'unit', 'integration', function () { cb(); });
});

gulp.task('watch', function () {
    gulp.watch([
        '**/*.js',
        'templates/**/*.js',
        '!test/integration/expected/**/*.js',
        '!test/integration/generated/**/*.js',
        '!node_modules/**/*.js',
        '!bower_components/**/*.js'
    ], ['test']);
});

gulp.task('default', ['test', 'watch']);