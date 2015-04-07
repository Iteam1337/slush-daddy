var proxyquire = require('proxyquire'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    gulp = require('gulp'),
    gutil = require('gulp-util');

chai.use(require('sinon-chai'));

describe('slush fdp', function () {
    var generator, inquirer, copyStuff, conflict, install, defaults, done, gulpDest;

    beforeEach(function () {
        gulpDest = sinon.spy();
        sinon.stub(gulp, 'dest', function () {
            return gutil.buffer(function(err, files) {
                gulpDest(files);
            });
        });
        conflict = sinon.spy(function () {
            return gutil.noop();
        });
        install = sinon.spy(function () {
            return gutil.noop();
        });
        copyStuff = proxyquire(process.cwd() + '/lib/copyStuff', {
            'gulp-install': install,
            'gulp-conflict': conflict
        });
        inquirer = {
            prompt: sinon.stub()
        };
        generator = proxyquire(process.cwd() + '/lib/generateApp', {
            'gulp': gulp,
            'inquirer': inquirer,
            './copyStuff': copyStuff
        });
        defaults = {
            appName: 'my app name'
        };
        done = sinon.spy();
    });
    afterEach(function () {
        gulp.dest.restore();
    });

    describe('questions', function () {
        it('asks questions', function () {
            generator(defaults)(done);
            expect(inquirer.prompt).calledOnce;
        });
        it('asks the correct type question', function () {
            generator(defaults)(done);
            var question = inquirer.prompt.firstCall.args[0][0];

            expect(question.name).to.equal('type');
            expect(question.type).to.equal('list');
            expect(question.choices).to.eql(['app', 'widget', 'ui', 'util']);
            expect(question.default).to.eql(0);
        });
        it('asks the correct name question', function () {
            generator(defaults)(done);
            var question = inquirer.prompt.firstCall.args[0][1];

            expect(question.name).to.equal('name');
            expect(question.default).to.equal('my app name');
        });
        it('asks the correct description question', function () {
            generator(defaults)(done);
            var question = inquirer.prompt.firstCall.args[0][2];

            expect(question.name).to.equal('appDescription');
        });
        it('asks the correct version question', function () {
            generator(defaults)(done);
            var question = inquirer.prompt.firstCall.args[0][3];

            expect(question.name).to.equal('appVersion');
            expect(question.default).to.equal('0.0.1');
        });
        it('asks the correct confirmation question', function () {
            generator(defaults)(done);
            var question = inquirer.prompt.firstCall.args[0][4];

            expect(question.name).to.equal('moveon');
            expect(question.type).to.equal('confirm');
        });
    });
    describe('copy', function () {
        it('copies and templates files correctly', function () {
            generator(defaults)(done);
            inquirer.prompt.yield({
                type: 'app',
                name: 'expected',
                appDescription: 'description',
                appVersion: '0.1.0',
                moveon: true
            });
            expect(gulp.dest).calledOnce;
        });
    });
});