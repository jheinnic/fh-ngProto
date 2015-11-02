(function () {
  'use strict';

  module.exports = 'fh-mgr.site.navigation';

  /**
   * @ngdoc overview
   * @name fh-mgr.site.navigation
   * @description TODO
   */
  angular.module(
    'fh-mgr.site.navigation',
    [
      'ui.router',
      /*
      require('fh-mgr.crosswords'),
      require('fh-mgr.context'),
      require('fh-mgr.authenticate'),
      */
      require('fh-mgr/site/notification/module'),
      require('fh-mgr/tools/navbar/module')
    ],
    require('./config')
  )
    .controller('HomeController', require('./HomeController.controller'))
  ;
}).call(window);
