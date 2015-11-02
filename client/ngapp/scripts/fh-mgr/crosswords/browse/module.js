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
      'cgnotify',
      'ui.router',
      'drahak.hotkeys',
      'tree.control',
      /*require('fh-mgr.context'),
      require('fh-mgr.authenticate'),*/
      require('fh-mgr/site/notification/module')
    ],
    require('./config')
  )
    // .service('XWInventoryCanvas', require('./XWInventoryCanvas.service'))
    .controller('XWInventoryController', require('./XWInventoryController.controller'))
  ;
}).call(window);
