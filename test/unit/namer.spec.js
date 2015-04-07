var chai = require('chai'),
    expect = chai.expect;

describe('lib/namer', function () {
    var namer;
    beforeEach(function () {
       namer = require(process.cwd() + '/lib/namer');
    });
    describe('#module', function () {
        var expected;
        beforeEach(function () {
            expected = 'my-module';
        });
        it('combines name and type correctly', function () {
            expect(namer('app', 'my-module').module()).to.equal(expected);
        });
        it('converts space correctly', function () {
            expect(namer('app', 'my module').module()).to.equal(expected);
        });
        it('converts camel case correctly', function () {
            expect(namer('app', 'myModule').module()).to.equal(expected);
        });
        it('converts pascal case correctly', function () {
            expect(namer('app', 'MyModule').module()).to.equal(expected);
        });
    });
    describe('#moduleFull', function () {
        var expected;
        beforeEach(function () {
            expected = 'app.my-module';
        });
        it('combines name and type correctly', function () {
            expect(namer('app', 'my-module').moduleFull()).to.equal(expected);
        });
    });
    describe('#appname', function () {
        var expected;
        beforeEach(function () {
            expected = 'BRO_App_MyModule';
        });
        it('constructs a proper app name from module', function () {
            expect(namer('app', 'my-module').app()).to.equal(expected);
        });
        it('constructs a proper app name from spaced module', function () {
            expect(namer('app', 'my module').app()).to.equal(expected);
        });
        it('constructs a proper app name from camel cased module', function () {
            expect(namer('app', 'myModule').app()).to.equal(expected);
        });
        it('constructs a proper app name from pascal cased module', function () {
            expect(namer('app', 'MyModule').app()).to.equal(expected);
        });
    });
    describe('deconstruct', function () {
        it('properly deconstructs an app name', function () {
            var properties = namer('BRO_App_MyModule').properties;
            expect(properties).to.eql({
                type: 'app',
                name: 'my module'
            });
        });
        it('properly deconstructs an app name with .', function () {
            var properties = namer('BRO_App.my.module').properties;
            expect(properties).to.eql({
                type: 'app',
                name: 'my module'
            });
        });
        it('properly deconstructs a non complete app name', function () {
            var properties = namer('expected').properties;
            expect(properties).to.eql({
                type: 'app',
                name: 'expected'
            });
        });
    });
    describe('#controllerName', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'PaymentsTransfers';
        });
        it('returns correct controller name for sentence', function () {
            expect(name.controller('payments transfers')).to.equal(expected);
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.controller('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.controller('payments-transfers')).to.equal(expected);
        });
    });
    describe('#controllerFull', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'app.payments-transfers.PaymentsTransfers';
        });
        it('returns correct controller name for sentence', function () {
            expect(name.controllerFull('payments transfers')).to.equal(expected);
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.controllerFull('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.controllerFull('payments-transfers')).to.equal(expected);
        });
    });
    describe('#className', function () {
        var name;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
        });
        it('returns correct controller name for sentence', function () {
            expect(name.className('payments transfers')).to.equal('app-payments-transfers-payments-transfers');
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.className('paymentsTransfers')).to.equal('app-payments-transfers-payments-transfers');
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.className('payments-transfers')).to.equal('app-payments-transfers-payments-transfers');
        });
    });
    describe('#service', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'paymentsTransfers';
        });
        it('returns correct controller name for sentence', function () {
            expect(name.service('payments transfers')).to.equal(expected);
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.service('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.service('payments-transfers')).to.equal(expected);
        });
    });
    describe('#serviceFull', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'app.payments-transfers.paymentsTransfers';
        });
        it('returns correct controller name for sentence', function () {
            expect(name.serviceFull('payments transfers')).to.equal(expected);
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.serviceFull('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.serviceFull('payments-transfers')).to.equal(expected);
        });
    });
    describe('#directive', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'paymentsTransfers';
        });
        it('returns correct directive name for sentence', function () {
            expect(name.directive('payments transfers')).to.equal(expected);
        });
        it('returns correct directive name for camelCase', function () {
            expect(name.directive('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct directive name for paramCase', function () {
            expect(name.directive('payments-transfers')).to.equal(expected);
        });
    });
    describe('#directiveController', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'PaymentsTransfersController';
        });
        it('returns correct directive name for sentence', function () {
            expect(name.directiveController('payments transfers')).to.equal(expected);
        });
        it('returns correct directive name for camelCase', function () {
            expect(name.directiveController('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct directive name for paramCase', function () {
            expect(name.directiveController('payments-transfers')).to.equal(expected);
        });
    });
    describe('#directiveFull', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'appPaymentsTransfersPaymentsTransfers';
        });
        it('returns correct controller name for sentence', function () {
            expect(name.directiveFull('payments transfers')).to.equal(expected);
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.directiveFull('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.directiveFull('payments-transfers')).to.equal(expected);
        });
    });
    describe('#directiveTag', function () {
        var name, expected;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
            expected = 'app-payments-transfers-payments-transfers';
        });
        it('returns correct controller name for sentence', function () {
            expect(name.directiveTag('payments transfers')).to.equal(expected);
        });
        it('returns correct controller name for camelCase', function () {
            expect(name.directiveTag('paymentsTransfers')).to.equal(expected);
        });
        it('returns correct controller name for paramCase', function () {
            expect(name.directiveTag('payments-transfers')).to.equal(expected);
        });
    });
    describe('#filename', function () {
        var name;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
        });
        it('returns the same name for unmodified files', function () {
            expect(name.file('bower', '.json')).to.equal('bower');
        });
        it('returns a correct file for module', function () {
            expect(name.file('module', '.js')).to.equal('payments-transfers.module');
        });
        it('returns a correct file for module test', function () {
            expect(name.file('module.spec', '.js')).to.equal('payments-transfers.module.spec');
        });
        it('returns a correct file for route', function () {
            expect(name.file('route', '.js')).to.equal('payments-transfers.route');
        });
        it('returns a correct file for module test', function () {
            expect(name.file('route.spec', '.js')).to.equal('payments-transfers.route.spec');
        });
        it('returns a correct file for controller js', function () {
            expect(name.file('controller', '.js', 'foo')).to.equal('foo.ctrl');
        });
        it('returns a correct file for controller html', function () {
            expect(name.file('controller', '.html', 'foo')).to.equal('foo');
        });
        it('returns a correct file for controller scss', function () {
            expect(name.file('controller', '.scss', 'foo')).to.equal('foo');
        });
        it('returns a correct file for controller test', function () {
            expect(name.file('controller.spec', '.js', 'foo')).to.equal('foo.ctrl.spec');
        });
        it('returns a correct file for service', function () {
            expect(name.file('service', '.js', 'foo')).to.equal('foo.srv');
        });
        it('returns a correct file for service test', function () {
            expect(name.file('service.spec', '.js', 'foo')).to.equal('foo.srv.spec');
        });
        it('returns a correct file for directive', function () {
            expect(name.file('directive', '.js', 'transaction item')).to.equal('transaction-item.dir');
        });
        it('returns a correct file for directive test', function () {
            expect(name.file('directive.spec', '.js', 'transaction item')).to.equal('transaction-item.dir.spec');
        });
    });
    describe('#folder', function () {
        var name;
        beforeEach(function () {
            name = namer('app', 'payments transfers');
        });
        it('returns correct path for main view as sentence', function () {
            expect(name.folder('./src/views', 'payments transfers')).to.equal('./src/views');
        });
        it('returns correct path for main view as camelCase', function () {
            expect(name.folder('./src/views', 'paymentsTransfers')).to.equal('./src/views');
        });
        it('returns correct path for main view as parameter case', function () {
            expect(name.folder('./src/views', 'payments-transfers')).to.equal('./src/views');
        });
        it('returns correct path for main directive with forced folder as sentence', function () {
            expect(name.folder('./src/directive', 'payments transfers', true)).to.equal('./src/directive/payments-transfers');
        });
        it('returns correct path for main directive with forced folder as camelCase', function () {
            expect(name.folder('./src/directive', 'paymentsTransfers', true)).to.equal('./src/directive/payments-transfers');
        });
        it('returns correct path for main directive with forced folder as parameter case', function () {
            expect(name.folder('./src/directive', 'payments-transfers', true)).to.equal('./src/directive/payments-transfers');
        });
        it('returns correct path for sub view as sentence', function () {
            expect(name.folder('./src/views', 'my payments')).to.equal('./src/views/my-payments');
        });
        it('returns correct path for sub view as camelCase', function () {
            expect(name.folder('./src/views', 'myPayments')).to.equal('./src/views/my-payments');
        });
        it('returns correct path for sub view as parameter case', function () {
            expect(name.folder('./src/views', 'my-payments')).to.equal('./src/views/my-payments');
        });
        it('returns correct path for directive with forced no-folder as sentence', function () {
            expect(name.folder('./src/directives', 'my payments', false)).to.equal('./src/directives');
        });
        it('returns correct path for directive with forced no-folder as camelCase', function () {
            expect(name.folder('./src/directives', 'myPayments', false)).to.equal('./src/directives');
        });
        it('returns correct path for directive with forced no-folder as parameter case', function () {
            expect(name.folder('./src/directives', 'my-payments', false)).to.equal('./src/directives');
        });
    });
});