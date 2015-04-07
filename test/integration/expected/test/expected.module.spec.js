describe('app.expected', function () {
    it('can instantiate the module', function () {
        expect(function () { module('app.expected'); }).not.toThrow();
    });
});