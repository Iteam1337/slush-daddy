(function () {
    'use strict';
    angular
        .module('<%= moduleName %>')
        .directive('<%= fullName %>', <%= name %>);

    /**
     * @namespace <%= name %>
     * @desc Describe what <%= name %> does!
     * @memberOf Directives
     */
    function <%= name %>() {
        var directive = {
            restrict: 'E',
            templateUrl: '<%= htmlPath %>',
            scope: {
                // add bindings here, ex: account: '='
            },
            link: linkFunc,
            controller: <%= controllerName %>,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            // do DOM manipulation here (if you absolutely have to)
        }
    }

    <%= controllerName %>.$inject = [
        '$scope',
        '$log'
    ];

    /**
     * @namespace <%= controllerName %>
     * @desc Describe what <%= controllerName %> does!
     * @memberOf Directives.<%= fullName %>
     */
    function <%= controllerName %>($scope, $log) {
        var vm = this; // our view model
        // add properties here, ex: vm.accounts = [];

        // add methods to controller here, ex: vm.updateAccounts = updateAccounts;

        function activate() {
            // put init code here
        }

        // add functions here, ex:
        // function updateAccounts(userId) {
        // }

        function destroy() {
            // put clean-up code here
        }

        $scope.$on('$destroy', destroy);
        activate();
    }
})();