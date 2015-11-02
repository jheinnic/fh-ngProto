(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name fh-mgr.crosswords.tickets
   * @description
   * A module encapsulating the artifact that provides an experience
   * supporting the collection of at-face ticket information against which
   * a subsequent result reporting artifact will be created to collect the
   * hidden information that yields the ticket's prize value.
   */
  angular.module(
    'fh-mgr.crosswords.tickets',
    [
      'ui.router',
      'drahak.hotkeys',
      'angularModalService',
      // require('fh-mgr.context'),
      // require('fh-mgr.authenticate'),
      // require('fh-mgr.modeling.core'),
      // require('fh-mgr.modeling.repository'),
      require('fh-mgr/tools/iconPanel/module'),
      require('fh-mgr/site/notification/module')
    ],
    require('./config')
  )
    .controller('BonusWordModalController', require('./BonusWordModalController.controller'))
    .controller('TicketController', require('./TicketController.controller'))
    .service('OpenTicketCanvas', require('./OpenTicketCanvas.service.coffee'))
    .factory('XwTicketModelPackage', require('./XwTicketModelPackage.factory.coffee'));
}).call(window);
