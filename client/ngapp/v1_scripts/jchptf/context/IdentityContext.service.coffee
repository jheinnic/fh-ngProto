'use strict'

module.exports = IdentityContext

IdentityContext.$inject = ['$q', 'ContextModelPackageFactory']

###*
# @ngdoc factory
# @name fh-mgr.context:IdentityContext
# @description
# Module for maintaining "global" application state that needs to be able
# to survive UI view changes and remain available for the duration of a
# user's interaction time with the application.
#.
# There are two known contexts at this time:
# <ol>
# <li>A user's authenticated login state, credential token, and
# the websocket session through which they receive pushed notifications
# from the server and establish a presence in the cluster.</li>
# <li>Project catalog and impact analysis metadata, synchronized with
# the backend to avoid the cost of redundant retrieval and also to
# inform users about unresolved change propagation requirements.</li>
# </ol>
####
class IdentityContext
  AuthTokenEventKind = undefined
  AuthTokenEvent = undefined

  constructor: ($q, ContextModelPackage) ->
    {AuthTokenEventKind,AuthTokenEvent} = ContextModelPackage

    Object.defineProperty(@, 'identityContextInternals',
      configurable: false
      enumerable: false
      editable: false
      value: new IdentityContextInternals($q)
    )
    Object.defineProperty(@, 'tokenEventListeners',
      configurable: false
      enumerable: false
      editable: false
      value: {}
    )

  isLoggedIn: () => @identityContextInternals.isLoggedIn()

  logout: () => @identityContextInternals.logout()

  ###*
  # Provides access to the authentication token service's information model.
  # Any service that manages state will have an accessor method like this for
  # retrieving CoffeeScript-derived types provided to define its data access
  # API.
  #.
  # The authentication token service uses value classes and enumerations to
  # expose its information content, and has no significant requirements that
  # require either factory/builders to enable two-way message/command for
  # reply/result exchanges, or mutable/interactive objects that encapsulate
  # behavioral aspects of the domain they model, but these patterns can be
  # found on other services.
  ####
  # getAuthTokenModel: () ->
  #   AuthTokenEventEnum: AuthTokenEventEnum,
  #   AuthTokenEventClass: AuthTokenEvent

  ###*
  #  @method
  #
  #  Unlike its stronger sibling, validateAuthTokenStatus(), this method
  #  just returns cached auth token state.  It does not look for an
  #  AUTH_TOKEN or attempt to decode it.  IF you have no reason to believe
  #  user has just returned with an AUTH_TOKEN, it is still more appropriate
  #  to use this method than validateAuthTokenStatus().
  #
  #  Also note that getAuthTokenStatus() is unable to fire events due to
  #  state changes, which is because it is returning old state about the
  #  most recent known state change.
  ###
  getLatestTokenEvent: () => @identityContextInternals.latestTokenEvent

  verifyAuthTokenStatus: () => @identityContextInternals.verifyAuthTokenStatus()

  getNextTokenEvent: () => @identityContextInternals.nextEventDefer.promise

  addTokenEventListener: (eventHandler) =>
    if @tokenEventListeners[eventHandler]
      throw new Error 'Cannot register an event handler twice'

    @tokenEventListeners[eventHandler] = eventHandler
    wrappedListener(event) ->
      if @tokenEventListeners[eventHandler]
        event.nextPromise.then(wrappedListener)
        try
          eventHandler(event)
        catch e
          # TODO: Error handling
          console.log(e)
    wrappedListener(@identityContextInternals.latestTokenEvent)

  dropTokenEventListener: (eventHandler) =>
    if ! delete @tokenEventListener[eventHandler]
      throw new Error 'Cannot de-register an unregistered event handler'

class IdentityContextInternals
  # AuthTokenEventKind = require('./AuthTokenEventKind.enum').AuthTokenEventKind

  constructor: ($q) ->
    # TODO: Add JWT token handling utilities, and tools for accepting
    #       delegated authentication tokens (e.g. OAuth2)
    @promiseService = $q
    @nextEventDefer = $q.defer
    @latestTokenEvent = new AuthTokenEvent
      eventType: AuthTokenEventKind.NO_TOKEN_AVAILABLE
      nextPromise: @nextEventDefer.promise

  decodeAuthToken = (authToken) ->
    # TODO: Add JWT token decoder
    # TODO: Add a current timestamp to the token deltas and set timers
    return new AuthTokenEvent
      uuid: 'fakeUuid',
      loginId: 'jheinnic'
      displayName: 'John'
      tokenExpiration: 3600000  # one hour
      tokenTimeout: 600000      # 10 minutes
      authToken: authToken
      eventType: AuthTokenEventKind.NEW_TOKEN_IS_VALID

  isLoggedIn: @latestTokenEvent.eventType.isLoggedIn

  verifyAuthTokenStatus: () =>
    retVal = @latestTokenEvent

    # TODO: Get a real token from the cookie environment
    authToken = "mockToken"

    if @isUserLoggedIn()
      if authToken && authToken != @latestTokenEvent.authToken
        # TODO: Check validity of new token
        retVal = @decodeAuthToken authToken

        if retVal.eventType == AuthTokenEventKind.TOKEN_WAS_REFRESHED
          @fireTokenEvent retVal
        else
          logoutTokenEvent = new AuthTokenEvent
            eventType: AuthTokenEventKind.NO_TOKEN_AVAILABLE
          @fireTokenEvent logoutTokenEvent
          @fireTokenEvent retVal
    else if authToken
      retVal = @decodeAuthToken authToken
      @fireTokenEvent retVal

  fireTokenEvent: (newEvent) =>
    @latestTokenEvent = newEvent
    previousPromise = @nextEventDefer.promise

    @nextEventDefer = @promiseService.defer
    newEvent.nextPromise = @nextEventDefer.nextPromise

    previousPromise.resolve newEvent

  logout: () =>
    @fireTokenEvent new AuthTokenEvent
      eventType: AuthTokenEventKind.NO_TOKEN_AVAILABLE

