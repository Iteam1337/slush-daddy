var gulp = require('gulp'),
    tasks = require('./build');

tasks.build.clean('clean');
tasks.build.concat('concat');
tasks.build.less('less');
tasks.build.templatecache('templatecache');
tasks.build.build('build');

tasks.test.lint('lint');
tasks.test.mocha('mocha');
tasks.test.karma('karma');

gulp.task('watch', function () {
    tasks.watch();
});


gulp.task('default', require('gulp-task-listing'));