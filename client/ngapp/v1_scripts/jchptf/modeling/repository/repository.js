(function() {
  'use strict';

  module.exports = 'fh-mgr.modeling.repository';

  /**
   * @ngdoc overview
   * @name fh-mgr.context
   * @description Context module that is responsible for tracking global state, such as current logged in user.
   */
  angular.module(
    'fh-mgr.modeling.repository',
    [
      'ng',
      'ngEventAggregator',
      'LocalForageModule',
      require('fh-mgr.modeling.core'),
    ]
  )
    .config(require('./repository.config.js'))
    .factory('RepositoryModelPackage', require('./RepositoryDomainPackage.factory.coffee'));
}).call(window);
