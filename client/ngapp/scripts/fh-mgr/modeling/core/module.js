(function() {
  'use strict';

  module.exports = 'fh-mgr.modeling.core';

  /**
   * @ngdoc overview
   * @name fh-mgr.modeling.core
   * @description General purpose Object utility package that are useful for more than just Document persistence,
   *              including a pattern for creating Enumerations and another for creating deep read-only clones.
   */
  angular.module('fh-mgr.modeling.core', [])
    .service('CoreModelPackage', require('./CoreModelPackage.service'))
    // .service('ModelUtils', require('./ModelUtils.service'))
  ;
}).call(window);
