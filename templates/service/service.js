(function () {
    'use strict';
    angular
        .module('<%= moduleName %>')
        .factory('<%= fullName %>', <%= name %>);

    // add dependencies here
    <%= name %>.$inject = [
        '$log'
    ];

    /**
     * @namespace <%= name %>
     * @desc Describe what <%= name %> does!
     * @memberOf Services
     */
    function <%= name %>($log) {
        var service = {
            // add properties here, ex: accounts: []

            // add methods here, ex: updateAccounts: updateAccounts
        };

        return service;
        ///////////////////

        // add functions here, ex: function updateAccounts() {}
    };
})();