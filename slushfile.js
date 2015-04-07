'use strict';

var gulp = require('gulp'),
    inquirer = require('inquirer'),
    namer = require('./lib/namer'),
    copyStuff = require('./lib/copyStuff'),
    generateApp = require('./lib/generateApp'),
    generateView = require('./lib/generateView'),
    generateService = require('./lib/generateService'),
    generateDirective = require('./lib/generateDirective');

function format(string) {
    var username = string ? string.toLowerCase() : '';
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        appName: namer.deconstruct(workingDirName).name,
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();

gulp.task('default', generateApp(defaults));
gulp.task('view', generateView());
gulp.task('service', generateService());
gulp.task('directive', generateDirective());