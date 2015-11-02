(function () {
  'use strict';

  module.exports = 'fh-mgr.crosswords';

  /**
   * @ngdoc overview
   * @name fh-mgr.crosswords
   * @description
   *
   * Root module for the "Crosswords" feature set.
   */
  angular.module(
    'fh-mgr.crosswords',
    [
      require('fh-mgr/crosswords/browse/module'),
      require('fh-mgr/crosswords/tickets/module')
      // require('fh-mgr.crosswords.results')
    ],
    require('./config')
  );
}).call(window);
