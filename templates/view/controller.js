(function () {
    'use strict';
    angular
        .module('<%= moduleName %>')
        .controller('<%= fullName %>', <%= name %>);

    // add dependencies here
    <%= name %>.$inject = [
        '$scope',
        '$log'
    ];

    /**
     * @namespace <%= name %>
     * @desc Describe what <%= name %> does!
     * @memberOf Controllers
     */
    function <%= name %>($scope, $log) {
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
    };
})();