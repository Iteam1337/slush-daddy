var inquirer = require('inquirer'),
    namer = require('./namer'),
    copyStuff = require('./copyStuff');

module.exports = function () {
    return function generateView(done) {
        var pkg = require(process.cwd()+'/package.json');
        var name = namer(pkg.name);
        var prompts = [{
            name: 'viewName',
            message: 'What is the name of the view?',
            default: name.module()
        }];

        inquirer.prompt(prompts,
            function (answers) {
                answers.name = name.controller(answers.viewName);
                answers.moduleName = name.moduleFull();
                answers.fullName = name.controllerFull(answers.viewName);
                answers.className = name.className(answers.viewName);

                var options = {
                    source: ['templates/view/**', '!templates/view/**/*.spec.js'],
                    target: name.folder('./src/views', answers.viewName),
                    npmInstall: false,
                    answers: answers,
                    renameFile: function (file) { file.basename = name.file(file.basename, file.extname, answers.viewName); }
                };
                copyStuff(options, function () {
                    options.source = 'templates/view/**/*.spec.js';
                    options.target = name.folder('./test/views', answers.viewName);
                    copyStuff(options, done);
                });
            });
    };
};