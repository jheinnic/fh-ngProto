(function() {
  'use strict';

  module.exports = browseRoutes;
  browseRoutes.$inject=['$stateProvider'];
  traverseRoot.$inject=['Repository'];

  // TODO: Make sure IdentityContext is wired in to the authenticate check
  // TODO: Add the project query to repository service.
  function browseRoutes ($stateProvider) {
    $stateProvider.state(
      'crosswords', {
        url: '/crosswords/browse',
        templateUrl: 'views/fh-mgr/crosswords/browse/browse_crosswords.view.html',
        controller: 'XwInventoryController',
        controllerAs: 'inventory',
        resolve: {
          traverseRoot: traverseRoot
        },
        abstract: false,
        authenticate: true
      }
    );
  }

  function traverseRoot(repository) {
    // Name without suffix gets the suffix.  There will be traverse() and traverseSync(), such that
    // we want traverse() here.
    return repository.rootFolder.traverse();
  }
}).call(window);
