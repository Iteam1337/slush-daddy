(function () {
    'use strict';

    angular.module('templates', []);
    angular.module('my-app', [
            'templates'
        ])
        .config(config)
        .run(run);

    config.$inject = [
        // provider dependencies
    ];

    run.$inject = [
        // instance dependencies
    ];

    function config() {

    }

    function run() {

    }
})();