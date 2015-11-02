'use strict'

module.exports = OpenTicketCanvas

class OpenTicketCanvas
  @$inject: ['XwTicketModelPackage']

  AbstractTicket: null

  constructor: (XwTicketModelPackage) ->
    @AbstractTicket = XwTicketModelPackage.AbstractTicket

  setTargetDocument: (ticketDocument) ->
    @openDocument = ticketDocument
    @ticketModel  = ticketDocument.getDocumentRoot()

  setBonusWord: (bonusWord) ->
    @ticketModel.setBonusWord(bonusWord)
