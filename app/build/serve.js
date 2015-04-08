var fs = require('fs'),
  connect = require('gulp-connect'),
  projectFiles = require('./projectFiles'),
  _ = require('lodash');

var servers = {};

function createHandler(url, file, assets) {
  return function(req, res, next) {
    if (req.url === url) {
      fs.readFile(file, {encoding: 'utf-8'}, function(err, body) {
        if (err) {
          return res.end(err.toString());
        }
        var data = projectFiles(assets);
        return res.end(_.template(body)(data));
      });
    } else {
      return next();
    }
  };
}

function serve(options, routes) {
  options = options || {};
  var port = options.port;

  if(!servers[port]) {
    var middlewares = [];
    Object.keys(routes).forEach(function (url) {
      var route = routes[url];
      middlewares.push(createHandler(url, route.file, route.assets));
    });
    options.middleware = function (app, opts) {
      return middlewares;
    };
    var server = connect.server(options);
    console.log('server', server);
    var _close = server.close;

    server.close = function () {
      //_close.apply(server, arguments);
      delete servers[port];
    };

    servers[port] = server;
  } else {
    console.log('server already started on port'. options.port);
  }

  return servers[options.port];
}

module.exports = serve;