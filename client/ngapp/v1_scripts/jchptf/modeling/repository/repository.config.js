(function() {
  'use strict';

  module.exports = configLocalForage;
  configLocalForage.$inject = ['$localForageProvider'];

  function configLocalForage($localForageProvider) {

    $localForageProvider.createInstance();
  }
}).call(window);
