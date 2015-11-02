(function () {
  'use strict';

  module.exports = keypressHelper;

  keypressHelper.$inject = ['$parse'];

  function keypressHelper($parse) {
    var keysByCode = {
      8: 'backspace',
      9: 'tab',
      13: 'enter',
      27: 'esc',
      32: 'space',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      45: 'insert',
      46: 'delete'
    };

    return function (scope, params) {
      var combinations = [];

      // Prepare combinations for simple checking
      angular.forEach(params, function (v, k) {
        var combination, expression;
        expression = $parse(v);

        angular.forEach(k.split(' '), function (variation) {
          combination = {
            expression: expression,
            keys: {}
          };
          angular.forEach(variation.split('-'), function (value) {
            combination.keys[value] = true;
          });
          combinations.push(combination);
        });
      });

      // Check only matching of pressed keys one of the conditions
      return function (event) {
        // No need to do that inside the cycle
        var metaPressed = !!(event.metaKey && !event.ctrlKey);
        var altPressed = !!event.altKey;
        var ctrlPressed = !!event.ctrlKey;
        var shiftPressed = !!event.shiftKey;
        var keyCode = event.keyCode;

        // Do NOT normalize key codes to a single case-- a-z are 97 to 122, A-Z are 65 to 90
        // ** keydown/keyup may bind a trigger to 'A'.  Caps-lock does not matter because browser
        //    normalizes these events as upper case.  (TODO: Verify uniform behavior)
        // ** keypress may bind a trigger to 'a', 'A', 'shift-A', or 'shift-a'  Caps-lock matters.
        //    shift-A fires when caps-lock is off, shift-a fires when it isn't.  In general,
        //    using shift-<alpha> is confusing and should be discouraged--just use 'a' or 'A'.
        // if (mode === 'keypress' && shiftPressed && keyCode >= 97 && keyCode <= 122) {
        //   keyCode = keyCode - 32;
        // }

        // Iterate over prepared combinations
        angular.forEach(combinations, function (combination) {
          var mainKeyPressed =
            combination.keys[keysByCode[keyCode]] ||
            combination.keys[String.fromCharCode(keyCode)];
          var metaRequired = !!combination.keys.meta;
          var altRequired = !!combination.keys.alt;
          var ctrlRequired = !!combination.keys.ctrl;
          var shiftRequired = !!combination.keys.shift;

          if (
            mainKeyPressed &&
            ( metaRequired === metaPressed ) &&
            ( altRequired === altPressed ) &&
            ( ctrlRequired === ctrlPressed ) &&
            ( shiftRequired === shiftPressed )
          ) {
            scope.$apply(function () {
              combination.expression(scope, {'$event': event});
            });
          }
        });
      };
    };
  }
}).call(window);
