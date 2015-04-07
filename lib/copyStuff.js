var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    path = require('path'),
    namer = require('./namer');

module.exports = function copyStuff(options, done) {
    var src = (options.source instanceof Array) ? options.source : [options.source];
    src = src.map(function (_path) {
        var isExclusion = _path.indexOf('!') === 0;
        if(isExclusion) { _path = _path.substring(1); }
        _path = path.resolve(__dirname, '../', _path);
        if(isExclusion) { _path = '!' + _path; }
        return _path;
    });
    var task = gulp.src(src)
        .pipe(template(options.answers))
        .pipe(rename(function (file) {
            if (file.basename[0] === '_') {
                file.basename = '.' + file.basename.slice(1);
            }
            if('function' === typeof options.renameFile) {
                options.renameFile(file);
            }
        }))
        .pipe(conflict(options.target))
        .pipe(gulp.dest(options.target));

    if(options.npmInstall) { task = task.pipe(install()); }
    task = task.on('end', function () { done(); });
    return task;
};