(function() {
  'use strict';

  module.exports = 'fh-mgr';

  /**
   * @ngdoc overview
   * @name loopbackExampleFullStackApp
   * @description
   * # loopbackExampleFullStackApp
   *
   * Main module of the application, primarily tasked with branching between
   * login page and the authenticated user's designated landing page.  Has no
   * routes of its own or pages of its own, but delegates to
   * 'fh-mgr.site.navigation' module, which in turn activates every feature
   * module to gather their routes.  Cross-cutting site service modules get
   * activated by the first feature encountered with a dependency on any of
   * their services.
   */
  angular.module(
    'fh-mgr',
    [
      'ng',
      'ui.router'
      /* require('fh-mgr.context'),
       require('fh-mgr.authenticate'),*/
      /*require('fh-mgr.site.notification/module'),
      require('fh-mgr.site.navigation/module')*/
    ],
    require('./config')
  )
    .run(require('./run'))
  ;
}).call(window);
