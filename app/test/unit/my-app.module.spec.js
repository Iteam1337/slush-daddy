describe('my-app', function () {
    it('can instantiate the module', function () {
        expect(function () { module('my-app'); }).to.not.throw();
    });
});