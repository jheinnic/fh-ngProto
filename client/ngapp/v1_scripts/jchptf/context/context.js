(function() {
  'use strict';

  module.exports = 'fh-mgr.context';

  /**
   * @ngdoc overview
   * @name fh-mgr.context
   * @description Context module that is responsible for tracking global state, such as current logged in user.
   */
  angular.module('fh-mgr.context', ['ng', 'ui.router', 'ngEventAggregator'])
    .service('IdentityContext', require('./IdentityContext.service.coffee'))
    .factory('ContextModelPackage', require('./ContextModelPackage.factory.coffee'));
}).call(window);
