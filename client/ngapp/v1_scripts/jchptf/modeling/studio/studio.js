(function () {
  'use strict';

  module.exports = 'fh-mgr.modeling.studio';

  /**
   * @ngdoc overview
   * @name fh-mgr.modeling.studio
   * @description
   */
  angular.module(
    'fh-mgr.modeling.studio', [
      'ng', 'ngEventAggregator', 'LocalForageModule', require('fh-mgr.modeling.core'), require('fh-mgr.modeling.repository')]
  )
    // .config(require('./studio.config.js'))
    // .factory('StudioModelPackage', require('./StudioDomainPackage.factory.coffee'))
  ;
}).call(window);
