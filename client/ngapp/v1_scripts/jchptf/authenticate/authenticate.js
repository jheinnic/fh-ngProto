(function() {
  'use strict';

  module.exports = 'fh-mgr.authenticate';

  /**
   * @ngdoc overview
   * @name fh-mgr.authenticate
   *
   * @description
   * Portfolio application's authentication module.
   */
  angular.module(
    'fh-mgr.authenticate',
    ['ng', 'ng-animate', 'angularModalService', 'toastr', require('fh-mgr.context')]
  )
    .config(require('./authenticate.config'))
    .controller('LoginController', require('./LoginController.controller'))
    .directive('ptfLoginModal', require('./ptfLoginModal.directive'));
}).call(window);
