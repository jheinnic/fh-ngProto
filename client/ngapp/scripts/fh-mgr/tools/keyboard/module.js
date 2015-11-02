(function() {
  'use strict';

  module.export = 'fh-mgr.tools.keyboard';

  angular.module('fh-mgr.tools.keyboard', ['ng', 'drahak.hotkeys'])
    .factory('KeypressHelper', require('./keypressHelper.factory'));
}).call(window);
