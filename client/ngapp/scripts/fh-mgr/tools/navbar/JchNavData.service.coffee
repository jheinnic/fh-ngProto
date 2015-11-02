module.exports =
  class JchNavData
    @$inject = ['$q', 'NavBarModelPackage']

    ###*
    # @type {lodash}
    ###
    _ = require('lodash')

    ###*
    # @constructor
    ###
    TabModel = undefined

    ###*
    # @constructor
    ###
    NavBarModel = undefined

    ###*
    # @constructor
    ###
    NavBarBuilder = undefined

    ###*
    # @type {Defer}
    ###
    updateHandle = undefined

    ###*
    # @type {NavBarModel}
  i ###
    nbDataModel = undefined

    ###*
    # @type {$q}
    ###
    $q = undefined


    ###*
    # JchNavData is a service singleton.
    #
    # @constructor
    ###
    constructor: (_$q_, NavBarModelPackage) ->
      {TabModel, NavBarModel, NavBarBuilder} = NavBarModelPackage

      $q = _$q_
      updateHandle = $q.defer()

      nbDataModel = new NavBarModel(
        brandName: 'John Heinnickel',
        tabModels: [
          new TabModel displayLabel: 'Home', matchRoute: /^\/home$/, clickRoute: '/home'
          new TabModel displayLabel: 'Crosswords', matchRoute: /^\/crosswords$/, clickRoute: '/crosswords'
          new TabModel displayLabel: 'Poker', matchRoute: /^\/poker\/odds$/, clickRoute: '/poker/odds'
          new TabModel displayLabel: 'Videos', matchRoute: /^\/videos$/, clickRoute: '/videos'
        ]
      )
      Object.freeze Object.seal @


    getNavBarModel: () ->
      retVal = _.cloneDeep nbDataModel
      retVal.refreshPromise = updateHandle.promise
      return Object.freeze retVal


    changeNavBarModel: (changeDirector) ->
      updatedModel  = _.cloneDeep nbDataModel
      navBarBuilder = new NavBarBuilder(updatedModel)
      changeDirector(navBarBuilder)

      if navBarBuilder.hasUpdatedModel?
        lastDefer = updateHandle
        updateHandle = $q.defer()
        nbDataModel  = updatedModel

        lastDefer.resolve( @getNavBarModel() )
