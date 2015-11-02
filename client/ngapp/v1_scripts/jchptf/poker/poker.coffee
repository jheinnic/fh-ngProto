xwModule = angular.module 'poker', [
  'ng'
  'ngDragDrop'
  'mgcrea.ngStrap.button'
  'jch-ui-blocks'
]

xwModule.config ['$routeProvider', ($routeProvider) ->
  $routeProvider.when '/poker/odds',
    templateUrl: '/app/poker/partials/view.html'
    controller: 'PokerCtrl'
]

xwModule.directive 'pokerCanvas', [ () ->
  restrict: 'E'
  replace: true
  templateUrl: '/app/poker/partials/pokerCanvas.html'
  scope:
    tableParams: '@'
    predictedOdds: '&'
    playerInputs: '='
  controler: ($scope, $elm, $attr) ->
]

xwModule.directive 'testGridOne', [() ->
  restrict: 'E'
  replace: true
  require: 'jhGrid'
  scope: false
  templateUrl: 'view/jchpft/poker/testGridOne.html'
  link: ( $scope, $element, $attr, gridCtrl ) ->
    changeContent = (clickScope, $event) ->
      if clickScope.cellModel.content == 'x'
        clickScope.controlModel.lifeStage = 'frozen'
      clickScope.cellModel.content = 'x'
      return

    gridCtrl.addDynamicImageLayer 'pkr-content', 'contentImage'
    gridCtrl.addClickHandler 'default', changeContent
    gridCtrl.addClickHandler 'frozen', null
    gridCtrl.populateGrid 4, 13, 28, 28, $scope.alphabetCells, '1D'
    return
]

#        this.beginEdit: (scope, inputOptions) ->
#          return
#
#        this.commitEdit: (withCommit) ->
#          return
#
#        this.rollback: (withCommit) ->
#          return
#
#        this.markDirty: (rollbackMemento) ->

xwModule.controller(
  'PokerCtrl',
  [
    '$scope'
    ($scope) ->
      $scope.outerModel = [
        {
          name: 'First',
          value: 1
        },
        {
          name: 'Second',
          value: 2
        },
        {
          name: 'Third',
          value: 3
        }
    ]
    $scope.controlModel = {
      lifeStage: 'default'
    }
    $scope.alphabetCells = [
      {content: 'a'}
      {content: 'b'}
      {content: 'c'}
      {content: 'd'}
      {content: 'e'}
      {content: 'f'}
      {content: 'g'}
      {content: 'h'}
      {content: 'i'}
      {content: 'j'}
      {content: 'k'}
      {content: 'l'}
      {content: 'm'}
      {content: 'n'}
      {content: 'o'}
      {content: 'p'}
      {content: 'q'}
      {content: 'r'}
      {content: 's'}
      {content: 't'}
      {content: 'u'}
      {content: 'v'}
      {content: 'w'}
      {content: 'x'}
      {content: 'y'}
      {content: 'z'}
    ]

    $scope.contentImage = {
      a: 'images/fh-mgr/crosswords/val/A.png'
      b: 'images/fh-mgr/crosswords/val/B.png'
      c: 'images/fh-mgr/crosswords/val/C.png'
      d: 'images/fh-mgr/crosswords/val/D.png'
      e: 'images/fh-mgr/crosswords/val/E.png'
      f: 'images/fh-mgr/crosswords/val/F.png'
      g: 'images/fh-mgr/crosswords/val/G.png'
      h: 'images/fh-mgr/crosswords/val/H.png'
      i: 'images/fh-mgr/crosswords/val/I.png'
      j: 'images/fh-mgr/crosswords/val/J.png'
      k: 'images/fh-mgr/crosswords/val/K.png'
      l: 'images/fh-mgr/crosswords/val/L.png'
      m: 'images/fh-mgr/crosswords/val/M.png'
      n: 'images/fh-mgr/crosswords/val/N.png'
      o: 'images/fh-mgr/crosswords/val/O.png'
      p: 'images/fh-mgr/crosswords/val/P.png'
      q: 'images/fh-mgr/crosswords/val/Q.png'
      r: 'images/fh-mgr/crosswords/val/R.png'
      s: 'images/fh-mgr/crosswords/val/S.png'
      t: 'images/fh-mgr/crosswords/val/T.png'
      u: 'images/fh-mgr/crosswords/val/U.png'
      v: 'images/fh-mgr/crosswords/val/V.png'
      w: 'images/fh-mgr/crosswords/val/W.png'
      x: 'images/fh-mgr/crosswords/val/X.png'
      y: 'images/fh-mgr/crosswords/val/Y.png'
      z: 'images/fh-mgr/crosswords/val/Z.png'
    }
  ]
)

xwModule.filter(
  'contentImage',
  [
    () ->
      contentImageHash = {
        a: 'images/fh-mgr/crosswords/val/A.png'
        b: 'images/fh-mgr/crosswords/val/B.png'
        c: 'images/fh-mgr/crosswords/val/C.png'
        d: 'images/fh-mgr/crosswords/val/D.png'
        e: 'images/fh-mgr/crosswords/val/E.png'
        f: 'images/fh-mgr/crosswords/val/F.png'
        g: 'images/fh-mgr/crosswords/val/G.png'
        h: 'images/fh-mgr/crosswords/val/H.png'
        i: 'images/fh-mgr/crosswords/val/I.png'
        j: 'images/fh-mgr/crosswords/val/J.png'
        k: 'images/fh-mgr/crosswords/val/K.png'
        l: 'images/fh-mgr/crosswords/val/L.png'
        m: 'images/fh-mgr/crosswords/val/M.png'
        n: 'images/fh-mgr/crosswords/val/N.png'
        o: 'images/fh-mgr/crosswords/val/O.png'
        p: 'images/fh-mgr/crosswords/val/P.png'
        q: 'images/fh-mgr/crosswords/val/Q.png'
        r: 'images/fh-mgr/crosswords/val/R.png'
        s: 'images/fh-mgr/crosswords/val/S.png'
        t: 'images/fh-mgr/crosswords/val/T.png'
        u: 'images/fh-mgr/crosswords/val/U.png'
        v: 'images/fh-mgr/crosswords/val/V.png'
        w: 'images/fh-mgr/crosswords/val/W.png'
        x: 'images/fh-mgr/crosswords/val/X.png'
        y: 'images/fh-mgr/crosswords/val/Y.png'
        z: 'images/fh-mgr/crosswords/val/Z.png'
        _: 'images/fh-mgr/crosswords/val/blank.png'
      }

      return (cellModel) ->
        contentKey = cellModel.content || '_'
        return contentImageHash[contentKey] || contentImageHash._
  ]
)
