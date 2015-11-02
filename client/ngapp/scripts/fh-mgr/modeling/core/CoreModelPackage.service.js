(function() {
  'use strict';

  module.exports = CoreModelPackage;
  CoreModelPackage.$inject = [];

  function CoreModelPackage() {
    this.Enum = require('fh-mgr/modeling/core/Enum.class');
    this.Module = require('fh-mgr/modeling/core/Module.class');
    this.ModelObject = require('fh-mgr/modeling/core/ModelObject.class');
  }
}).call(window);
