describe('<%= fullName %>', function () {

    var $rootScope, $scope, $httpBackend, element, scope, vm;

    beforeEach(module('<%= moduleName %>', function ($provide) {
        // add mocks here, ex: $provide.value('app.services.foo', foo);
    }));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        // handle commonly called urls
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', '/.out/resources/languages/sv.lang.json').respond({});
        $httpBackend.when('GET', /\/TDE_DAP_Portal_REST_WEB\/api\/v3\/identification\/\?dsid=/).respond({});
        $httpBackend.when('GET', /\/TDE_DAP_Portal_REST_WEB\/api\/v3\/identification\/touch\?dsid=/).respond({});

        var tag = '<<%= tagName %>></<%= tagName %>>';
        var html = '<div></div>';
        var $compile = $injector.get('$compile');
        var $templateCache = $injector.get('$templateCache');
        $templateCache.put('<%= {htmlPath %>}', html);

        element = $compile(tag)($scope);
        $scope.$digest();
        scope = element.isolateScope();
        vm = scope.vm;
    }));
    it('can create the element', function () {
        expect(element).toBeDefined();
    });
    it('can retrieve the isolate scope', function () {
        expect(scope).toBeDefined();
    });
    it('can retrieve the controller', function () {
        expect(vm).toBeDefined();
    });
});