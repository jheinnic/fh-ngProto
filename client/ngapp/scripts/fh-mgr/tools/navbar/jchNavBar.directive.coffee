module.exports = jchNavBar =
  # (JchNavData, NavBarModelPackage) ->
  #   jchNavBar.$inject = ['JchNavData', 'NavBarModelPackage']
  #   {NavBarModel, TabModel} = NavBarModelPackage
  (JchNavData) ->
    jchNavBar.$inject = ['JchNavData']
    _ = require('lodash')

    return {
      restrict: 'E'
      scope: { }
      templateUrl: 'views/fh-mgr/tools/navbar/jch_navbar.html'
      link: ($scope) ->
        updateModel = (data) ->
          data.refreshPromise.then(updateModel)
          $scope.navDataModel = _.omit(data, 'refreshPromise')

        updateModel(JchNavData.getNavBarModel())
    }
