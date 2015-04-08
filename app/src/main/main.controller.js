(function () {
  'use strict';
  angular
    .module('my-app')
    .controller('Main', Main);

  // add dependencies here
  Main.$inject = [
    '$scope',
    '$log'
  ];

  /**
   * @namespace Main
   * @desc Describe what Main does!
   * @memberOf Controllers
   */
  function Main($scope, $log) {
    var vm = this; // our view model
    // add properties here, ex: vm.accounts = [];
    vm.name = 'Johan';

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