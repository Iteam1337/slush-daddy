var gulp = require('gulp'),
    test = require('./build/test');

test.lint(gulp, 'lint');
test.test(gulp, 'test');

gulp.task('watch', function () {
    test.watch(gulp);
});
