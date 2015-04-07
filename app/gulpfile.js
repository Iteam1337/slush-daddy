var gulp = require('gulp'),
    test = require('./build/test');

test.lint(gulp, 'lint');
test.mocha(gulp, 'mocha');

gulp.task('watch', function () {
    test.watch(gulp);
});


gulp.task('default', require('gulp-task-listing'));