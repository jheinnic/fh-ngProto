(function () {
  'use strict';

  module.exports = 'fh-mgr.tools.navbar';

  /**
   * @ngdoc overview
   * @name fh-mgr.tools.navbar
   * @description
   * A reusable component for creating navigation bars with data-driven content that allows the application
   * to change the navigation content over time.
   */
  angular.module('fh-mgr.tools.navbar', ['ng', 'mgcrea.ngStrap.navbar'])
    .service('JchNavData', require('./JchNavData.service.coffee'))
    .directive('jchNavBar', require('./jchNavBar.directive.coffee'))
    .factory('NavBarModelPackage', require('./NavBarModelPackage.factory.coffee'));
}).call(window);
