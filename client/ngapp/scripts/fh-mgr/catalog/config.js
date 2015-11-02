(function() {
  'use strict';

  module.exports = crosswordsRoutes;
  crosswordsRoutes.$inject = ['$stateProvider'];

  // TODO: Make sure IdentityContext is wired in to the authenticate check
  function crosswordsRoutes ($stateProvider) {
    $stateProvider.state(
      'crossword', {
        templateUrl: 'views/fh-mgr/crosswords/crossword.view.html',
        controllerAs: 'crossword',
        authenticate: true,
        abstract: true
      }
    );
  }
}).call(window);
