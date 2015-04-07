var inquirer = require('inquirer'),
    namer = require('./namer'),
    copyStuff = require('./copyStuff');

module.exports = function () {
    return function generateService(done) {
        var pkg = require(process.cwd()+'/package.json');
        var name = namer(pkg.name);
        var prompts = [{
            name: 'serviceName',
            message: 'What is the name of the service?',
            default: name.module()
        }];

        inquirer.prompt(prompts,
            function (answers) {
                answers.name = name.service(answers.serviceName);
                answers.moduleName = name.moduleFull();
                answers.fullName = name.serviceFull(answers.serviceName);
                answers.className = name.className(answers.serviceName);

                var options = {
                    source: ['templates/service/**', '!templates/service/**/*.spec.js'],
                    target: './src/services',
                    npmInstall: false,
                    answers: answers,
                    renameFile: function (file) { file.basename = name.file(file.basename, file.extname, answers.serviceName); }
                };
                copyStuff(options, function () {
                    options.source = 'templates/service/**/*.spec.js';
                    options.target = './test/services';
                    copyStuff(options, done);
                });
            });
    };
};