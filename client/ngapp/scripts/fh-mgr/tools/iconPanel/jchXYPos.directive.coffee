module.exports = jchXyPosDirective =
  ($parse) ->
    jchXyPosDirective.$inject = ['$parse']

    attrRegEx = /^\s*(?:\(\s*([\S]+)\s*,\s*([\S]+)\s*\)\s+at\s+)?([\d]+)\s+by\s+([\d]+)\s*$/

    return {
      restrict: 'A'
      scope: false
      link: ($scope, $elem, $attr) ->
        rowIdExpr =     'cellModel.rowId'
        cellHeight =    null
        colIdExpr =     'cellModel.colId'
        cellWidth =     null

        watchTopFn =    null
        watchLeftFn =   null
        watchWidthFn =  null
        watchHeightFn = null

        handleLeftFn = () ->
          if watchLeftFn? then watchLeftFn()
          leftFn = $parse colIdExpr + ' * ' + cellWidth + ' + "px"'
          if !leftFn.constant
            watchLeftFn = $scope.$watch leftFn, (value) -> $elem.css 'left', value
          else
            watchLeftFn = null
            $elem.css 'left', leftFn($scope)

        handleWidthFn = () ->
          if watchWidthFn? then watchWidthFn()
          widthFn = $parse cellWidth + ' + "px"'
          if !widthFn.constant
            watchWidthFn = $scope.$watch widthFn, (value) -> $elem.css 'width', value
          else
            watchWidthFn = null
            $elem.css 'width', widthFn($scope)
          handleLeftFn()

        handleTopFn = () ->
          if watchTopFn? then watchTopFn()
          topFn = $parse rowIdExpr + ' * ' + cellHeight + ' + "px"'
          if !topFn.constant
            watchTopFn = $scope.$watch topFn, (value) -> $elem.css 'top', value
          else
            watchTopFn = null
            $elem.css 'top', topFn($scope)

        handleHeightFn = () ->
          if watchHeightFn? then watchHeightFn()
          heightFn = $parse cellHeight + ' + "px"'
          if !heightFn.constant
            watchHeightFn = $scope.$watch heightFn, (value) -> $elem.css 'height', value
          else
            watchHeightFn = null
            $elem.css 'height', heightFn($scope)
          handleTopFn()

        $attr.$observe 'jchXyPos', (expression) ->
          match = expression.match attrRegEx
          if match
            if angular.isUndefined(match[1]) then match[1] = 'cellModel.rowId'
            if angular.isUndefined(match[2]) then match[2] = 'cellModel.colId'

            if cellWidth != match[3]
              colIdExpr  = match[2]
              cellWidth  = match[3]
              handleWidthFn()
            else if colIdExpr != match[2]
              colIdExpr  = match[2]
              handleLeftFn()
            if cellHeight != match[4]
              cellHeight = match[4]
              rowIdExpr  = match[1]
              handleHeightFn()
            else if rowIdExpr != match[1]
              rowIdExpr  = match[1]
              handleTopFn()
    }
