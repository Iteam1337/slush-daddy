describe('<%= fullName %>', function () {

    var $rootScope, $httpBackend, $scope, vm;

    beforeEach(module('<%= moduleName %>'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        // handle commonly called urls
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/.out/resources/languages/sv.lang.json').respond({});
        $httpBackend.when('GET', /\/TDE_DAP_Portal_REST_WEB\/api\/v3\/identification\/\?dsid=/).respond({});
        $httpBackend.when('GET', /\/TDE_DAP_Portal_REST_WEB\/api\/v3\/identification\/touch\?dsid=/).respond({});

        var $controller = $injector.get('$controller');
        vm = $controller('<%= fullName %>', {
            $scope: $scope
            // put mocks here
        });
    }));
    it('can create the controller', function () {
        expect(vm).toBeDefined();
    });
});