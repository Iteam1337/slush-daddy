(function () {
    'use strict';
    angular
        .module('<%= moduleName %>')
        .directive('<%= fullName %>', <%= name %>);

    <%= name %>.$inject = [
        '$log'
    ];

    /**
     * @namespace <%= name %>
     * @desc Describe what <%= name %> does!
     * @memberOf Directives
     */
    function <%= name %>($log) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            // add properties here, ex: scope.accounts = [];

            // add methods to scope here, ex: scope.updateAccounts = updateAccounts;

            function activate() {
                // put init code here
            }

            // add functions here, ex:
            // function updateAccounts(userId) {
            // }

            function destroy() {
                // put clean-up code here
            }

            scope.$on('$destroy', destroy);
            activate();
        }
    }
})();