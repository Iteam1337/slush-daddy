var inquirer = require('inquirer'),
    namer = require('./namer'),
    copyStuff = require('./copyStuff');

module.exports = function () {
    return function generateDirective(done) {
        var pkg = require(process.cwd()+'/package.json');
        var name = namer(pkg.name);
        var prompts = [{
            name: 'directiveName',
            message: 'What is the name of the directive?',
            default: name.module()
        },{
            name: 'directiveType',
            message: 'What type of directive do you want?',
            type: 'list',
            choices: ['element', 'attribute'],
            default: 0
        }];

        inquirer.prompt(prompts,
            function (answers) {
                answers.name = name.directive(answers.directiveName);
                answers.moduleName = name.moduleFull();
                answers.fullName = name.directiveFull(answers.directiveName);
                answers.tagName = name.directiveTag(answers.directiveName);
                answers.attributeName = name.directiveTag(answers.directiveName);
                answers.controllerName = name.directiveController(answers.directiveName);
                answers.htmlPath = name.folder('directives', answers.directiveName, true) +
                '/' +
                name.file('directive', answers.directiveName) +
                '.html';

                var createSubFolder = ('element' === answers.directiveType);

                var options = {
                    source: [
                        'templates/directive/' + answers.directiveType + '/**',
                        '!templates/directive/' + answers.directiveType + '/**/*.spec.js'
                    ],
                    target: name.folder('./src/directives', answers.directiveName, createSubFolder),
                    npmInstall: false,
                    answers: answers,
                    renameFile: function (file) { file.basename = name.file(file.basename, file.extname, answers.directiveName); }
                };
                copyStuff(options, function () {
                    options.source = 'templates/directive/' + answers.directiveType + '/**/*.spec.js';
                    options.target = './test/directives';
                    copyStuff(options, done);
                });
            });
    };
};