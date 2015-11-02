/**
 * Created by John on 5/16/2015.
 */
(function() {
  'use strict';

  module.exports = ModelUtils;

  function ModelUtils() {
  }

  var _ = require('lodash');

  ModelUtils.prototype.makeImmutable = function makeImmutable(obj) {
    var key;
    for (key in Object.getOwnPropertyNames(obj)) {
      if (obj.hasOwnProperty(key)) makeImmutable(obj[key]);
    }

    if ((typeof obj === 'object' && obj !== null) ||
      (Array.isArray ? Array.isArray(obj) : obj instanceof Array) ||
      (typeof obj === 'function')) {

      Object.freeze(obj);
    }
    // return obj;
  };

  /**
   * Wraps getter with a function that will only permit member functions of clazz to call.
   *
   * To lock out unwanted access, call Object.freeze() on your class prototype after defining it, otherwise
   * the protection offered can be violated by adding methods to break through.
   */
  ModelUtils.prototype.restrictToClass = function restrictToClass(privateFn, clazz) {
    var callFn;
    callFn = function() {
      if (_.valuesIn(clazz.prototype).indexOf(callFn.caller) >= 0) {
        return privateFn.apply(this, arguments);
      }
      throw new Error('Illegal Call');
    };
    return callFn;
  };
}).call(window);
