var mbf = require('main-bower-files'),
  globby = require('globby'),
  path = require('path');

function bowerDependencies(includeDev) {
  return mbf(['**/*.js', '!**/mocha/*', '!**/chai/*', '!**/sinon*/**'], {includeDev:includeDev})
    .map(function (filePath) {
      return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    });
}

function getAll(options) {
  return {
    dependencies: bowerDependencies(options.includeDev),
    code: globby.sync(options.code),
    tests: globby.sync(options.tests)
  };
}

getAll.bowerDependencies = bowerDependencies;

module.exports = getAll;