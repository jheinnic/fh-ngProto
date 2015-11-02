(function() {
  'use strict';

  module.exports = ticketsRoutes;
  ticketsRoutes.$inject = ['$stateProvider'];
  documentCanvas.$inject = ['Studio'];

  // TODO: Make sure IdentityContext is wired in to the authenticate check
  // TODO: Add the project query to repository service.
  function ticketsRoutes ($stateProvider) {
    $stateProvider.state(
      'crossword.ticket', {
        url: '/crosswords/tickets/:ticketId',
        controller: 'TicketController',
        resolve: {
            documentCanvas: documentCanvas
        },
        abstract: false
      }
    );
  }

  function documentCanvas(Studio) {
    return 'TBD: ' + Studio;
  }
}).call(window);
