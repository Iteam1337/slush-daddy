var inquirer = require('inquirer'),
    namer = require('./namer'),
    copyStuff = require('./copyStuff');

module.exports = function (defaults) {
    return function generateApp(done) {
        var prompts = [{
            name: 'type',
            message: 'What type of module are you creating?',
            type: 'list',
            choices: ['app', 'widget', 'ui', 'util'],
            default: 0
        }, {
            name: 'name',
            message: 'What is the name of your module (ex "my module")?',
            default: defaults.appName
        }, {
            name: 'appDescription',
            message: 'What is the description?'
        }, {
            name: 'appVersion',
            message: 'What is the version of your project?',
            default: '0.0.1'
        }, {
            type: 'confirm',
            name: 'moveon',
            message: 'Continue?'
        }];
        //Ask
        inquirer.prompt(prompts,
            function (answers) {
                if (!answers.moveon) {
                    console.log('did not move on');
                    return done();
                }
                var name = namer(answers.type, answers.name);
                answers.appName = name.app();
                answers.moduleName = name.moduleFull();
                var options = {
                    source: 'templates/app/**',
                    target: './',
                    npmInstall: true,
                    answers: answers,
                    renameFile: function (file) {
                        file.basename = name.file(file.basename, file.extname);
                    }
                };
                copyStuff(options, done);
            });
    };
};