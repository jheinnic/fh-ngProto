(function() {
  'use strict';

  module.exports = 'fh-mgr.site.notification';

  /**
   * @ngdoc overview
   * @name fh-mgr.site.notification
   * @description
   *
   * A directive for placing an area for asynchronous application messages
   * at a suitable location in a view and a service for accepting them
   * from places where events trigger.
   */
  angular.module(
    'fh-mgr.site.notification',
    ['ng', /*'ui.bootstrap',*/ 'toastr']
  );
}).call(window);
