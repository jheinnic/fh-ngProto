module.exports = NavBarModelPackage =
  () ->
    NavBarModelPackage.$inject = []

    _ = require('lodash')
    url = require('url')

    class NavBarModel
      constructor: (params) ->
        {@brandName, @tabModels, @refreshPromise} = params

        unless @brandName? then @brandName = ''
        unless @tabModels? then @tabModels = []

    class TabModel
      constructor: (params) ->
        {displayLabel, clickRoute, matchRoute} = params

        parsedRoute = url.parse(clickRoute)
        switch
          when clickRoute != parsedRoute.path
            throw new Error "clickRoute, #{clickRoute}, does not match parsed route, #{parsedRoute.path}"
          when parsedRoute.query?.match(/\?/)?
            throw new Error "clickRoute, #{clickRoute}, has more than one query separator"
          when clickRoute.match(/:/)?
            throw new Error "clickRoute, #{clickRoute}, must supply path variable values, not bindings."

        if matchRoute?
          unless clickRoute.match(matchRoute)?
            throw new Error "If given, matchRoute, #{matchRoute}, must be a regex match to clickRoute, #{clickRoute}"
        else
          matchRoute = new RegEx("^#{clickRoute}$")

        Object.defineProperties(
          @,
          {
            displayLabel: {
              enumerable: true
              get: () -> return displayLabel
            }
            clickRoute: {
              enumerable: true
              get: () -> return clickRoute
            }
            matchRoute: {
              enumerable: true
              get: () -> return matchRoute
            }
          }
        )
        Object.seal(@)

      getMatchRoute: () -> matchRoute


    class NavBarBuilder
      constructor: (navBarModel) ->
        unless navBarModel? then navBarModel = new NavBarModel

        Object.defineProperty(
          @, 'changed', configurable: false, enumeable: false, editable: true, value: false)
        Object.defineProperty(
          @, 'tabCount', configurable: false, enumeable: false, editable: true, value: navBarModel.tabModels.length)
        Object.defineProperty(
          @, 'navBarModel', configurable: false, enumeable: false, editable: false, value: navBarModel)

      setBrandName: (brandName) =>
        if @navBarModel.brandName != brandName
          @navBarModel.brandName = brandName
          @changed = true

        return @

      removeTabByName: (displayName) =>
        _.filter(
          @navBarModel.tabModels,
          (tabModel) -> return if tabModel.displayName == displayName then false else true
        )

        newLength = @navBarModels.tabModels.length
        if newLength < @tabCount
          @changed = true
          @tabCount = newLength
        else
          throw new Error "No such tab named #{displayName}"

        return @

      addTab: (index, displayName, clickRoute, matchRoute) =>
        if index > @tabCount
          throw new Error "#{index} is beyond the end of the current tab list.  Max index = #{@tabCount}"
        else if index < 0
          throw new Error "Index must be at least 0, but given #{index}"

        # TODO: Make sure displayName is unique

        newTab = new TabModel(displayName, clickRoute, matchRoute)
        @navBarModel.tabModels = _.flatten( @navBarModel.tabModels, newTab, @navBarModel.tabModels.splice(index))
        @changed = true

        return @

      getBrandName: () =>
        return @navBarModel.displayName

      listTabNames: () =>
        return _.map(@navBarModel.tabModels, (tabModel) -> @displayName)

      hasUpdatedModel: () =>
        return @changed

      # navBarModel is not an enumerable property, but it can be read by other members of this package that
      # have implicit knowledge about its existence.

    return NavBarModel: NavBarModel, TabModel: TabModel, NavBarBuilder: NavBarBuilder
