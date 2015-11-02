(function() {
  'use strict';

  module.exports = BonusWordModalController;

  BonusWordModalController.$inject = ['OpenTicketCanvas'];

  function BonusWordModalController(OpenTicketCanvas) {
    this.activeTicketModel = OpenTicketCanvas;
  }
}).call(window);

