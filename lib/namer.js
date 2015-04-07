var changeCase = require('change-case');

function deconstruct(appname) {
    var type, name;
    var tokens = appname.replace('.', '_').split('_');
    if(tokens.length === 1) {
        type = 'app';
        name = tokens[0];
    } else if(tokens.length === 2) {
        type = tokens[0];
        name = tokens[1];
    } else {
        type = tokens[1];
        name = tokens[2];
    }
    return {
        type: type.toLowerCase(),
        name: changeCase.sentence(name)
    };
}

function Namer(type, name) {
    if(!name) {
        var deconstructed = deconstruct(type);
        type = deconstructed.type;
        name = deconstructed.name;
    }
    this.properties = {
        type: type,
        name: name
    };
}

Namer.prototype.module = function () {
    return changeCase.paramCase(this.properties.name);
};

Namer.prototype.moduleFull = function () {
    return this.properties.type + '.' + this.module();
};

Namer.prototype.app = function () {
    return 'BRO_' +
        changeCase.pascalCase(this.properties.type) +
        '_' +
        changeCase.pascalCase(this.properties.name);
};

Namer.prototype.folder = function (basepath, name, createFolder) {
    var foldername = changeCase.paramCase(name);
    if('undefined' === typeof createFolder) {
        createFolder = (this.module() !== foldername);
    }
    if(createFolder) {
        basepath += '/' + foldername;
    }
    return basepath;
};

Namer.prototype.controller = function (name) {
    return changeCase.pascalCase(name);
};

Namer.prototype.controllerFull = function (name) {
    return this.moduleFull() + '.' + this.controller(name);
};

Namer.prototype.file = function (basename, type, newName) {
    switch(basename) {
        case 'module': return this.module() + '.module';
        case 'route.spec': return this.module() + '.route.spec';
        case 'route': return this.module() + '.route';
        case 'module.spec': return this.module() + '.module.spec';
        case 'controller': return changeCase.paramCase(newName) + (('.js' === type) ? '.ctrl' : '');
        case 'controller.spec': return changeCase.paramCase(newName) + '.ctrl.spec';
        case 'service': return changeCase.paramCase(newName) + '.srv';
        case 'service.spec': return changeCase.paramCase(newName) + '.srv.spec';
        case 'directive': return changeCase.paramCase(newName) + '.dir';
        case 'directive.spec': return changeCase.paramCase(newName) + '.dir.spec';
        default: return basename;
    }
};

Namer.prototype.className = function (name) {
    return changeCase.paramCase(this.controllerFull(name));
};

Namer.prototype.service = function (name) {
    return changeCase.camelCase(name);
};

Namer.prototype.serviceFull = function (name) {
    return this.moduleFull() + '.' + this.service(name);
};

Namer.prototype.directive = function (name) {
    return changeCase.camelCase(name);
};

Namer.prototype.directiveController = function (name) {
    return changeCase.pascalCase(name) + 'Controller';
};

Namer.prototype.directiveFull = function (name) {
    return changeCase.camelCase(this.moduleFull() + '.' + name);
};

Namer.prototype.directiveTag = function (name) {
    return changeCase.paramCase(this.moduleFull() + '.' + name);
};

function constructor(type, name) {
    return new Namer(type, name) ;
}
constructor.deconstruct = deconstruct;

module.exports = constructor;