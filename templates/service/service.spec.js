describe('<%= fullName %>', function () {

    var $rootScope, $httpBackend, service;

    beforeEach(module('<%= moduleName %>', function ($provide) {
        // add mocks here, ex: $provide.value('app.services.foo', foo);
    }));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');

        // handle commonly called urls
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/.out/resources/languages/sv.lang.json').respond({});
        $httpBackend.when('GET', /\/TDE_DAP_Portal_REST_WEB\/api\/v3\/identification\/\?dsid=/).respond({});
        $httpBackend.when('GET', /\/TDE_DAP_Portal_REST_WEB\/api\/v3\/identification\/touch\?dsid=/).respond({});

        service = $injector.get('<%= fullName %>');
    }));
    it('can create the service', function () {
        expect(service).toBeDefined();
    });
});