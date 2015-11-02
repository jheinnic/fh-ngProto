(function() {
  'use strict';

  module.exports = 'fh-mgr.tools.iconPanel';

  angular.module(
    'fh-mgr.tools.iconPanel', ['ng', require('fh-mgr/tools/keyboard/module')]
  )
    .directive('jchXYPos', require('./jchXYPos.directive.coffee'))
    .directive('jhCanvas', require('./jhCanvas.directive.coffee'))
    .directive('jhGrid', require('./jhGrid.directive.coffee'));
}).call(window);
