describe('<%= moduleName %>', function () {
    it('can instantiate the module', function () {
        expect(function () { module('<%= moduleName %>'); }).not.toThrow();
    });
});