define [
  'angular'
  'ui-utils'
  'angular-strap/button'
  'cs!jch-ui-blocks/main'
  'cs!xw-dynamic/main'
  'cs!xw-model/main'
  'cs!xw-report/main'
], () ->
  xwModule = angular.module('xw-ticket', ['ng', 'mgcrea.ngStrap.button', 'ui.keypress', 'jch-ui-blocks', 'xw-dynamic', 'xw-model', 'xw-report']);

  xwModule.config ['$routeProvider', ($routeProvider) ->
    $routeProvider.when '/crosswords',
      templateUrl: '/app/xw-ticket/partials/view.html'
      controller: 'CrosswordCtrl'
  ]

  xwModule.directive 'xwTicket', ['xwModelFactory', 'xwReportService', (xwModelFactory, xwReportService) ->
    restrict: 'E'
    replace: true
    scope:
      ticketDocument: '='
      conditionModel: '='
    templateUrl: '/app/xw-ticket/partials/xwTicket.html',
    link: ($scope, $element, $attrs, canvasCtrl) ->
      # $scope.ticketModel  = xwModelFactory.createModelFromDocument $scope.ticketDocument
      $scope.conditionModel =
        allHorizontalWords: []
        allVerticalWords: []
        allGridWords: []
        allBasicWords: []
        allTriplingWords: []
        xwEditMode: if $scope.ticketDocument.content.search(/[A-Z]/) > -1 then 'placeTriples' else 'letters'
      $scope.controlModel =
        activeCanvasTask: 'none'
        clickYourLetters: if $scope.ticketDocument.lifeStage == 'PLAYING' then 'open' else 'ignore'
        clickBonusWord: if $scope.ticketDocument.lifeStage == 'DESCRIBE' then 'open' else 'ignore'
        clickCrossword: if $scope.ticketDocument.lifeStage == 'DESCRIBE' then 'open' else 'ignore'

      $scope.$watch 'ticketDocument.lifeStage', (newValue) ->
        if newValue == 'PLAYING'
          $scope.controlModel.clickYourLetters = 'open'
          $scope.controlModel.clickBonusWord = 'ignore'
          $scope.controlModel.clickCrossword = 'ignore'
        else if newValue == 'DESCRIBE'
          $scope.controlModel.clickYourLetters = 'ignore'
          $scope.controlModel.clickBonusWord = 'open'
          $scope.controlModel.clickCrossword = if $scope.conditionModel.xwEditMode == 'letters' then 'open' else 'placeTriples'

      $scope.$watch 'ticketDocument.content', (newValue) ->
        boardContent = newValue.split('')
        rotatedContent = boardContent.map (value, index, board) ->
          colId = index % 11
          rowId = ((index-colId) / 11)
          return board[(colId*11) + rowId]

        allHorizontalWords = []
        allVerticalWords = []

        isValidWord = (subStr) ->
          return ((typeof subStr) == 'string') && (subStr.length > 2) && (subStr.length < 10)

        examineLine = (ii) ->
          jj = ii+10
          allHorizontalWords = $scope.conditionModel.allHorizontalWords.concat boardContent.slice(ii,jj).join('').split(/_+/).filter(isValidWord)
          allVerticalWords = $scope.conditionModel.allVerticalWords.concat rotatedContent.slice(ii,jj).join('').split(/_+/).filter(isValidWord)
        examineLine(ii) for ii in [0...121] by 11

        allGridWords = allHorizontalWords.concat allVerticalWords
        allTriplingWords = allGridWords.filter( (word) -> word.search(/[A-Z]/) > -1 )
        allBasicWords = allGridWords.filter( (word) -> return allTriplingWords.indexOf(word) == -1 )

        $scope.conditionModel.allHorizontalWords = allHorizontalWords
        $scope.conditionModel.allVerticalWords = allVerticalWords
        $scope.conditionModel.allTriplingWords = allTriplingWords
        $scope.conditionModel.allBasicWords = allBasicWords
        $scope.conditionModel.allGridWords = allGridWords

        # TODO: Populate a progressModel alongside conditionModel and use the format more approriate for reporting
        #       and for yourLetters watching to mutate as discovery progresses.  ('* and - used to indicate covered
        #       letters with and without tripplied modifiers, respectively, and an associated array of uncovered
        #       letters coupled with the display string.  Use only allTripling and allBasic words, initially
        #       populated into uncovered variants.  Include empty "covered" collections.  The YourLetters watch
        #       routine may move words from one collection to the other at the appropriate time.
        # TODO: Switch the isolated scope data binding from conditionModel to progressModel.
        $scope.progressModel.uncoveredTriplingWords =
          allTriplingWords.map (word) ->
            return analyzeTriplingWord(word, [])
        $scope.progressModel.uncoveredBasicWords =
          allBasicWords.map (word) ->
            return analyzeBasicWord(word, [])
        $scope.progressModel.coveredTriplingWords = []
        $scope.progressModel.coveredBasicWords = []

        return

      $scope.$watchCollection 'ticketDocument.yourLetters', (newValue) ->
        yourLettersArray = newValue.split('')
        # TODO: Update reportService with a Discovery update.

      $scope.$watchCollection 'ticketModel.bonusWordArray', (newValue) ->
        $scope.conditionModel.bonusWord = newValue

# TODO: Update reportService with a Discovery update.

# TODO: Use data binding to watch the conditionModel in a reporting component to update display stats.
#        xwReportService.updateTicketDescription({
#          ticketId: $scope.ticketDocument.ticketId
#          basicWords: $scope.conditionModel.allBasicWords
#          tripleWords: $scope.conditionModel.allTriplingWords
#          bonusWord: $scope.ticketDocument.bonusWord
#        })
        return

      $scope.lockCrosswordLetters = () ->
        if( $scope.conditionModel.allHorizontalWords.length < 10 || $scope.conditionModel.allHorizontalWords.length > 12 ||
            $scope.conditionModel.allVerticalWords.length < 10 || $scope.conditionModel.allVerticalWords.length > 12 ||
            $scope.conditionModel.allGridWords.length < 22 || $scope.conditionModel.allGridWords.length > 22 ||
            $scope.ticketModel.lifeStage != 'DESCRIBE' )
          # Conditions not met.  Fail.
          return

        $scope.conditionModel.xwEditMode = 'placeTriples'
        $scope.controlModel.clickCrossword = 'placeTriples'
        if $scope.controlModel.activeCanvasTask == 'editCrossword'
          $scope.controlModel.activeCanvasTask = 'none'

      clearCursor = () ->
        $scope.controlModel.cursorRow = -1
        $scope.controlModel.cursorCol = -1

      canvasCtrl.addControlState 'none', $scope, null, clearCursor, angular.noop

      return
  ]

  analyzeBasicWord = (rawWordStr, revealedLetters) ->
    missingLetterArray = new Array(rawWordStr.length)
    missingLetterHash = {}
    isComplete = true

    displayWordStr =
      rawWordStr.split('').map(
        (nextChar) ->
          if (revealedLetters[nextChar] > 0)
            nextChar = '*'
          else
            isComplete = false
            if missingLetterHash[nextChar] < 1
              missingLetterHash[nextChar] = 1
              missingLetterArray.push(nextChar)
          return nextChar
      ).join('')

    return {
      isComplete: isComplete
      rawWordStr: rawWordStr
      displayWordStr: displayWordStr
      requiredLetters: missingLetterArray
    }

  analyzeTriplingWord = (rawWordStr, revealedLetters) ->
    missingLetterArray = new Array(rawWordStr.length)
    missingLetterHash = {}
    isComplete = true

    displayWordStr =
      rawWordStr.split('').map(
        (nextChar) ->
          if (revealedLetters[nextChar] > 0)
            nextChar = '*'
          else
            nextChar = nextChar.toLowerCase()
            if(revealedLetters[nextChar] > 0)
              nextChar = '#'
            else
              isComplete = false
              if missingLetterHash[nextChar] < 1
                missingLetterHash[nextChar] = 1
                missingLetterArray.push(nextChar)
          return nextChar
      ).join('')

    return {
      isComplete: isComplete
      rawWordStr: rawWordStr
      displayWordStr: displayWordStr
      requiredLetters: missingLetterArray
    }

  class BasicWordAnalysis extends AbstractWordAnalysis
    constructor: (rawWordStr, revealedLetters) ->
      super(rawWordStr, revealedLetters)
      return

  class TriplingWordAnalysis
    constructor: (rawWordStr, revealedLetters) ->
      super(rawWordStr, revealedLetters)
      return

    deriveDisplayWord: (missingLetterArray, revealedLetters) ->
      @displayWordStr =
        @rawWordStr.split('').map(
          (nextChar) ->
            if (revealedLetters[nextChar] > 0)
              nextChar = '*'
            else
              nextChar = nextChar.toLowerCase()
              if(revealedLetters[nextChar] > 0)
                nextChar = '#'
              else
                @isComplete = false
                if @missingLetterHash[nextChar] < 1
                  @missingLetterHash[nextChar] = 1
                  missingLetterArray.push(nextChar)
              return nextChar
        ).join('')


  baseMementoHelper = {
    storeMemento: (cellScope) ->
      cellModel = cellScope.cellModel
      cellScope.memento = {
        cellContent: cellModel.cellContent
        hasModifier: cellModel.hasModifier
        fillState:   cellModel.fillState
      }

    rollback: (cellScope) ->
      cellModel = cellScope.cellModel
      memento   = cellScope.memento

      cellModel.cellContent = memento.cellContent
      cellModel.hasModifier = memento.hasModifier
      cellModel.fillState   = memento.fillState

      Object.delete cellScope.memento
  }

  ylMementoHelper = angular.extend({
    commit: (cellScope) ->
      cellModel  = cellScope.cellModel
      cellIndex  = cellScope.rowId*6 + cellScope.colId
      # TODO: Access cellIndex via a scope method instead

      lettersArray = cellScope.ticketModel.yourLettersArray
      lettersArray[cellIndex] = cellModel.content
      Object.delete cellScope.memento
      return
  }, baseMementoHelper)

  xwModule.directive 'xwYourLettersGrid', ['jhDirtyTracker', (jhDirtyTracker) ->
    editKeyBindings =
      'a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z': 'handleAlpha($event)'
      'esc': 'handleEscape($event)'
      'enter': 'handleEnter($event)'
      'right': 'handleRightArrow($event)'
      'left': 'handleLeftArrow($event)'
      'down': 'handleDownArrow($event)'
      'up': 'handleUpArrow($event)'

    return {
      restrict: 'E'
      replace: true
      require: ['^jhCanvas', 'jhGrid']
      scope: true
      templateUrl: '/app/xw-ticket/partials/yourLettersGrid.html'
      link: ($scope, $element, $attrs, ctrlArray) ->
        canvasCtrl = ctrlArray[0]
        gridCtrl = ctrlArray[1]

        # gridCtrl.setCellTagName 'yourLettersCell'

        gridCtrl.addDynamicImageLayer 'xw-fill', 'xwCellFill'
        gridCtrl.addDynamicImageLayer 'xw-content', 'xwCellContent'
        gridCtrl.addFixedImageLayer 'xw-grid', '/app/xw-ticket/images/border/grid.png'
        gridCtrl.addDynamicImageLayer 'xw-border', 'xwCellBorder'

        gridCtrl.addClickHandler 'ignore', null
        gridCtrl.addClickHandler 'open', (clickScope, $event) ->
          $scope.controlModel.activeCanvasTask = 'editYourLetters'
          $scope.controlModel.cursorRow = clickScope.rowId
          $scope.controlModel.cursorCol = clickScope.colId

        gridCtrl.addClickHandler 'move', (clickScope, $event) ->
          $scope.controlModel.cursorRow = clickScope.rowId
          $scope.controlModel.cursorCol = clickScope.colId

        $scope.getWorkspaceId = () ->
          return $scope.ticketModel.ticketId + '_' + 'yourLetters'

        $scope.getCursorScope = () ->
          return gridCtrl.getScopeByCoordinates $scope.controlModel.cursorRow, $scope.controlModel.cursorCol

        ##
        ## Cursor based key stroke handlers
        $scope.handleAlpha = (inputValue) ->
          inputValue = inputValue.toLowerCase()
          cursorScope = $scope.getCursorScope()
          if cursorScope.getContent() != inputValue
            if $scope.ticketModel.revealedLetters[inputValue] > 0
              # TODO: Flash error message about rejecting input--its already present in another cell!
              console.error 'Cannot add ' + inputValue + ' to Your Letters more than once!'
            else
              jhDirtyTracker.markDirty cursorScope
              cursorScope.setContent inputValue
              $scope.handleRightArrow()
          return

        $scope.handleBackspace = ($event) ->
          cursorScope = $scope.getCursorScope()
          if cursorScope.hasContent()
            jhDirtyTracker.markDirty cursorScope
            cursorScope.setContent('_')
          return

        $scope.handleLeftArrow = ($event) ->
          if $scope.controlModel.cursorCol > 0
            $scope.controlModel.cursorCol = $scope.controlModel.cursorCol - 1
          else
            $scope.controlModel.cursorCol = 5
            $scope.handleUpArrow()
          return

        $scope.handleRightArrow = ($event) ->
          if $scope.controlModel.cursorCol < 5
            $scope.controlModel.cursorRow = $scope.controlModel.cursorRow + 1
          else
            $scope.controlModel.cursorCol = 0
            $scope.handleDownArrow()
          return

        $scope.handleUpArrow = ($event) ->
          if $scope.controlModel.cursorRow > 0
            $scope.controlModel.cursorRow = $scope.controlModel.cursorRow - 1
          else
            $scope.controlModel.cursorRow = 2
          return

        $scope.handleDownArrow = ($event) ->
          if $scope.controlModel.cursorRow < 2
            $scope.controlModel.cursorRow = $scope.controlModel.cursorRow + 1
          else
            $scope.controlModel.cursorRow = 0
          return

        $scope.handleEscape = ($event) ->
          $scope.conditionModel.ylChangeIntent = 'rollback'
          $scope.controlModel.activeCanvasTask = 'none'
          $scope.controlModel.cursorRow = -1
          $scope.controlModel.cursorCol = -1
          return

        $scope.handleEnter = ($event) ->
          $scope.conditionModel.ylChangeIntent = 'commit'
          $scope.controlModel.activeCanvasTask = 'none'
          $scope.controlModel.cursorRow = -1
          $scope.controlModel.cursorCol = -1
          return

        beginYlEdit = () ->
          workspaceId = $scope.getWorkspaceId()
          jhDirtyTracker.trackChanges workspaceId, ylMementoHelper
          $scope.conditionModel.ylChangeIntent = 'commit'
          $scope.controlModel.clickYourLetters = 'move'

        endYlEdit = () ->
          workspaceId = $scope.getWorkspaceId()
          jhDirtyTracker.clearDirtyList workspaceId, $scope.conditionModel.ylChangeIntent
          $scope.conditionModel.ylChangeIntent = 'commit'

          if $scope.ticketModel.lifeStage == 'PLAYING'
            $scope.controlModel.clickYourLetters = 'open'
          else
            $scope.controlModel.clickYourLetters = 'ignore'

        canvasCtrl.addControlState 'editYourLetters', editKeyBindings, beginYlEdit, endYlEdit
        gridComplete = gridCtrl.populateGrid(3, 6, 28, 28, $scope.ticketModel.yourLettersGrid, '1D')

        initCellScope = (cellScope) ->
          cellScope.$watch('cellModel.cellContent', (newValue, oldValue) ->
            if newValue != oldValue
              $scope.ticketModel.revealedLetters[oldValue] -= 1
            $scope.ticketModel.revealedLetters[newValue] += 1
            return
          )
          cellScope.getCellContent = () ->
            return cellScope.cellModel.cellContent
          cellScope.setCellContent = (contentValue) ->
            cellScope.cellModel.cellContent = contentValue
            return
          cellScope.hasContent = () ->
            return (cellScope.cellModel.cellContent != '_')
          cellScope.isBlank = () ->
            return (cellScope.cellModel.cellContent == '_')
          return

        initCellScope(gridComplete[ii][jj]) for jj in [0...6] for ii in [0...3]
    }
  ]

  bwMementoHelper = angular.extend({
    commit: (cellScope) ->
      cellModel  = cellScope.cellModel
      bonusWordArray = cellScope.ticketModel.bonusWordArray
      bonusWordArray[cellScope.colId] = cellModel.content
      Object.delete cellScope.memento
      return
  }, baseMementoHelper)

  xwMementoHelper = angular.extend({
    commit: (cellScope) ->
      cellModel  = cellScope.cellModel
      cellIndex  = cellScope.rowId*11 + cellScope.colId
      # TODO: Access cellIndex via a scope method instead

      xwContentArray = cellScope.ticketModel.crosswordArray
      xwContentArray[cellIndex] = if cellModel.hasModifier then cellModel.content.toUpperCase() else cellModel.content
      Object.delete cellScope.memento
      return
  }, baseMementoHelper)

  xwModule.directive 'xwBonusWordGrid', ['jhDirtyTracker', (jhDirtyTracker) ->
    editKeyBindings =
      'a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z': 'handleAlpha($event)'
      'esc': 'handleEscape($event)'
      'enter': 'handleEnter($event)'
      'right': 'handleRightArrow($event)'
      'left': 'handleLeftArrow($event)'

    return {
    restrict: 'E'
    replace: true
    require: ['^jhCanvas', 'jhGrid']
    scope: true
    templateUrl: '/app/xw-ticket/partials/bonusWordGrid.html'
    link: ($scope, $element, $attrs, ctrlArray) ->
      canvasCtrl = ctrlArray[0]
      gridCtrl = ctrlArray[1]

      # gridCtrl.setCellTagName 'yourLettersCell'

      gridCtrl.addDynamicImageLayer 'xw-fill', 'xwCellFill'
      gridCtrl.addDynamicImageLayer 'xw-content', 'xwCellContent'
      gridCtrl.addFixedImageLayer 'xw-grid', '/app/xw-ticket/images/border/grid.png'
      gridCtrl.addDynamicImageLayer 'xw-border', 'xwCellBorder'

      gridCtrl.addClickHandler 'ignore', null
      gridCtrl.addClickHandler 'open', (clickScope, $event) ->
        $scope.controlModel.activeCanvasTask = 'editBonusWordGrid'
        $scope.controlModel.cursorRow = clickScope.rowId
        $scope.controlModel.cursorCol = clickScope.colId

      gridCtrl.addClickHandler 'move', (clickScope, $event) ->
        $scope.controlModel.cursorRow = clickScope.rowId
        $scope.controlModel.cursorCol = clickScope.colId

      $scope.getWorkspaceId = () ->
        return $scope.ticketModel.ticketId + '_' + 'bonusWordGrid'

      $scope.getCursorScope = () ->
        return gridCtrl.getScopeByCoordinates $scope.controlModel.cursorRow, $scope.controlModel.cursorCol

      ##
      ## Cursor based key stroke handlers
      $scope.handleAlpha = (inputValue) ->
        inputValue = inputValue.toLowerCase()
        cursorScope = $scope.getCursorScope()
        if cursorScope.getContent() != inputValue
          if !cursorScope.isBlocked()
            jhDirtyTracker.markDirty cursorScope
            cursorScope.setContent inputValue
            $scope.handleRightArrow()
        return

      $scope.handleBackspace = ($event) ->
        cursorScope = $scope.getCursorScope()
        if cursorScope.hasContent()
          jhDirtyTracker.markDirty cursorScope
          cursorScope.setContent('_')
        return

      $scope.handleLeftArrow = ($event) ->
        if $scope.controlModel.cursorCol > 0
          $scope.controlModel.cursorCol = $scope.controlModel.cursorCol - 1
        else
          $scope.controlModel.cursorCol = 4
        return

      $scope.handleRightArrow = ($event) ->
        if $scope.controlModel.cursorCol < 4
          $scope.controlModel.cursorRow = $scope.controlModel.cursorRow + 1
        else
          $scope.controlModel.cursorCol = 0
        return

      $scope.handleEscape = ($event) ->
        $scope.conditionModel.bwChangeIntent = 'rollback'
        $scope.controlModel.activeCanvasTask = 'none'
        $scope.controlModel.cursorRow = -1
        $scope.controlModel.cursorCol = -1
        return

      $scope.handleEnter = ($event) ->
        $scope.conditionModel.bwChangeIntent = 'commit'
        $scope.controlModel.activeCanvasTask = 'none'
        $scope.controlModel.cursorRow = -1
        $scope.controlModel.cursorCol = -1
        return

      beginBwEdit = () ->
        workspaceId = $scope.getWorkspaceId()
        jhDirtyTracker.trackChanges workspaceId, 'isADirtyProperty', bwMementoHelper
        $scope.conditionModel.bwChangeIntent = 'commit'
        $scope.controlModel.clickBonusWord = 'move'

      endBwEdit = () ->
        workspaceId = $scope.getWorkspaceId()
        jhDirtyTracker.clearDirtyList workspaceId, $scope.conditionModel.bwChangeIntent
        $scope.conditionModel.bwChangeIntent = 'commit'

        if $scope.ticketModel.lifeStage == 'DESCRIBE'
          $scope.controlModel.clickBonusWord = 'open'
        else
          $scope.controlModel.clickBonusWord = 'ignore'

      canvasCtrl.addControlState 'editBonusWordGrid', editKeyBindings, beginBwEdit, endBwEdit
      gridComplete = gridCtrl.populateGrid(1, 5, 28, 28, $scope.ticketModel.bonusWordGrid, '1D')

      initCellScope = (cellScope) ->
        cellScope.$watch('cellModel.cellContent', (newValue, oldValue) ->
          if newValue != oldValue
            $scope.ticketModel.bonusLetters[oldValue] -= 1
          $scope.ticketModel.bonusLetters[newValue] += 1
          return
        )
        cellScope.getCellContent = () ->
          return cellScope.cellModel.cellContent
        cellScope.setCellContent = (contentValue) ->
          cellScope.cellModel.cellContent = contentValue
          return
        cellScope.hasContent = () ->
          return (cellScope.cellModel.cellContent != '_')
        cellScope.isBlank = () ->
          return (cellScope.cellModel.cellContent == '_')
        return

      initCellScope(gridComplete[ii][jj]) for jj in [0...5] for ii in [0...1]
    }
  ]

  xwModule.directive 'xwCrosswordGrid', ['jhDirtyTracker', (jhDirtyTracker) ->
    editKeyBindings =
      'a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z': 'handleAlpha($event)'
      'esc': 'handleEscape($event)'
      'enter': 'handleEnter($event)'
      'right': 'handleRightArrow($event)'
      'left': 'handleLeftArrow($event)'
      'down': 'handleDownArrow($event)'
      'up': 'handleUpArrow($event)'

    return {
      restrict: 'E'
      replace: true
      require: ['^jhCanvas', 'jhGrid']
      scope: true
      templateUrl: '/app/xw-ticket/partials/crosswordGrid.html'
      link: ($scope, $element, $attrs, ctrlArray) ->
        canvasCtrl = ctrlArray[0]
        gridCtrl = ctrlArray[1]

        # gridCtrl.setCellTagName 'yourLettersCell'

        gridCtrl.addDynamicImageLayer 'xw-fill', 'xwCellFill'
        gridCtrl.addDynamicImageLayer 'xw-content', 'xwCellContent'
        gridCtrl.addFixedImageLayer 'xw-grid', '/app/xw-ticket/images/border/grid.png'
        gridCtrl.addDynamicImageLayer 'xw-border', 'xwCellBorder'

        gridCtrl.addClickHandler 'ignore', null
        gridCtrl.addClickHandler 'open', (clickScope, $event) ->
          $scope.controlModel.activeCanvasTask = 'editCrosswordGrid'
          $scope.controlModel.cursorRow = clickScope.rowId
          $scope.controlModel.cursorCol = clickScope.colId

        gridCtrl.addClickHandler 'move', (clickScope, $event) ->
          $scope.controlModel.cursorRow = clickScope.rowId
          $scope.controlModel.cursorCol = clickScope.colId

        $scope.getWorkspaceId = () ->
          return $scope.ticketModel.ticketId + '_' + 'crosswordGrid'

        $scope.getCursorScope = () ->
          return gridCtrl.getScopeByCoordinates $scope.controlModel.cursorRow, $scope.controlModel.cursorCol

        ##
        ## Cursor based key stroke handlers
        $scope.handleAlpha = (inputValue) ->
          inputValue = inputValue.toLowerCase()
          cursorScope = $scope.getCursorScope()
          if cursorScope.getContent() != inputValue
            if !cursorScope.isBlocked()
              jhDirtyTracker.markDirty cursorScope
              cursorScope.setContent inputValue
              $scope.advanceCursor()
          return

        $scope.handleBackspace = ($event) ->
          cursorScope = $scope.getCursorScope()
          if cursorScope.hasContent()
            jhDirtyTracker.markDirty cursorScope
            cursorScope.setContent('_')
            $scope.backstepCursor()
          return

        $scope.handleLeftArrow = ($event) ->
          if $scope.controlModel.xwCursorDir != 'left'
            $scope.controlModel.xwCursorDir = 'left'
          else if $scope.controlModel.cursorCol > 0
            $scope.controlModel.cursorCol = $scope.controlModel.cursorCol - 1
          else
            console.log('Cursor cannot move any further left')
          return

        $scope.handleRightArrow = ($event) ->
          if $scope.controlModel.xwCursorDir != 'right'
            $scope.controlModel.xwCursorDir = 'right'
          else if $scope.controlModel.cursorCol < 10
            $scope.controlModel.cursorCol = $scope.controlModel.cursorCol + 1
          else
            console.log('Cursor cannot move any further right')
          return

        $scope.handleUpArrow = ($event) ->
          if $scope.controlModel.xwCursorDir != 'up'
            $scope.controlModel.xwCursorDir = 'up'
          else if $scope.controlModel.cursorRow > 0
            $scope.controlModel.cursorRow = $scope.controlModel.cursorRow - 1
          else
            console.log('Cursor cannot move any further up')

        $scope.handleDownArrow = ($event) ->
          if $scope.controlModel.xwCursorDir != 'down'
            $scope.controlModel.xwCursorDir = 'down'
          else if $scope.controlModel.cursorRow < 10
            $scope.controlModel.cursorRow = $scope.controlModel.cursorRow + 1
          else
            console.log('Cursor cannot move any further down')

        $scope.handleEscape = ($event) ->
          $scope.conditionModel.xwChangeIntent = 'rollback'
          $scope.controlModel.activeCanvasTask = 'none'
          $scope.controlModel.cursorRow = -1
          $scope.controlModel.cursorCol = -1
          return

        $scope.handleEnter = ($event) ->
          $scope.conditionModel.xwChangeIntent = 'commit'
          $scope.controlModel.activeCanvasTask = 'none'
          $scope.controlModel.cursorRow = -1
          $scope.controlModel.cursorCol = -1
          return

        beginXwEdit = () ->
          workspaceId = $scope.getWorkspaceId()
          jhDirtyTracker.trackChanges workspaceId, 'isADirtyProperta', xwMementoHelper
          $scope.conditionModel.xwChangeIntent = 'commit'
          $scope.controlModel.clickYourLetters = 'move'

#        beginXwTriplesEdit = () ->
#          workspaceId = $scope.getWorkspaceId()
#          jhDirtyTracker.trackChanges workspaceId, 'isADirtyProperta',  xwMementoHelper
#          $scope.conditionModel.xwChangeIntent = 'commit'
#          $scope.controlModel.clickYourLetters = 'placeTriples'

        endXwEdit = () ->
          workspaceId = $scope.getWorkspaceId()
          jhDirtyTracker.clearDirtyList workspaceId, $scope.conditionModel.xwChangeIntent
          $scope.conditionModel.xwChangeIntent = 'commit'

          if $scope.ticketModel.lifeStage == 'DESCRIBE'
            if $scope.conditionModel.xwEditMode == 'letters'
              $scope.controlModel.clickCrossword = 'open'
            else
              $scope.controlModel.clickCrossword = 'placeTriples'
          else
            $scope.controlModel.clickCrossword = 'ignore'

        canvasCtrl.addControlState 'editCrosswordGrid', editKeyBindings, beginXwEdit, endXwEdit
        gridComplete = gridCtrl.populateGrid(11, 11, 28, 28, $scope.ticketModel.crosswordGrid, '1D')

        initCellScope = (cellScope) ->
          cellScope.$watch('cellModel.cellContent', (newValue, oldValue) ->
            return
          )
          cellScope.getCellContent = () ->
            return cellScope.cellModel.cellContent
          cellScope.setCellContent = (contentValue) ->
            cellScope.cellModel.cellContent = contentValue
            return
          cellScope.hasContent = () ->
            return (cellScope.cellModel.cellContent != '_')
          cellScope.isBlank = () ->
            return (cellScope.cellModel.cellContent == '_')
          return

        initCellScope(gridComplete[ii][jj]) for jj in [0...11] for ii in [0...11]
      }
  ]

  xwModule.directive 'xwCrosswordCell', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.cellDirective('crossword')
  ]

  xwModule.directive 'xwBonusValueCell', () ->
    restrict: 'E'
    replace: true
    require: '^xwTicket'
    scope: false
    templateUrl: '/app/xw-ticket/partials/bonusValueCell.html'
  xwModule.directive 'xwBonusValue', () ->
    restrict: 'E'
    replace: true
    require: '^xwTicket'
    scope: false
    templateUrl: '/app/xw-ticket/partials/bonusValue.html'

  xwModule.value 'xwContentImageHash', {
    a: '/app/xw-ticket/images/val/A.png'
    b: '/app/xw-ticket/images/val/B.png'
    c: '/app/xw-ticket/images/val/C.png'
    d: '/app/xw-ticket/images/val/D.png'
    e: '/app/xw-ticket/images/val/E.png'
    f: '/app/xw-ticket/images/val/F.png'
    g: '/app/xw-ticket/images/val/G.png'
    h: '/app/xw-ticket/images/val/H.png'
    i: '/app/xw-ticket/images/val/I.png'
    j: '/app/xw-ticket/images/val/J.png'
    k: '/app/xw-ticket/images/val/K.png'
    l: '/app/xw-ticket/images/val/L.png'
    m: '/app/xw-ticket/images/val/M.png'
    n: '/app/xw-ticket/images/val/N.png'
    o: '/app/xw-ticket/images/val/O.png'
    p: '/app/xw-ticket/images/val/P.png'
    w: '/app/xw-ticket/images/val/Q.png'
    r: '/app/xw-ticket/images/val/R.png'
    s: '/app/xw-ticket/images/val/S.png'
    t: '/app/xw-ticket/images/val/T.png'
    u: '/app/xw-ticket/images/val/U.png'
    v: '/app/xw-ticket/images/val/V.png'
    w: '/app/xw-ticket/images/val/W.png'
    x: '/app/xw-ticket/images/val/X.png'
    y: '/app/xw-ticket/images/val/Y.png'
    z: '/app/xw-ticket/images/val/Z.png'
    _: '/app/xw-ticket/images/val/blank.png'
    cursor: '/app/xw-ticket/images/val/qm.png'
    blank: '/app/xw-ticket/images/val/blank.png'
    undefined: '/app/xw-ticket/images/val/blank.png'
  }

  xwModule.filter 'xwCellContent', ['xwContentImageHash', (xwContentImageHash) ->
    return (cellModel) ->
      if !cellModel?
        content = undefined
      else
        content = cellModel.content? || undefined
      return xwContentImageHash[content] || xwContentImageHash.undefined
  ]

  xwModule.value 'xwBorderImageHash', {
    htop: '/app/xw-ticket/images/border/htop.png'
    hmid: '/app/xw-ticket/images/border/hmid.png'
    hend: '/app/xw-ticket/images/border/hend.png'
    vtop: '/app/xw-ticket/images/border/vtop.png'
    vmid: '/app/xw-ticket/images/border/vmid.png'
    vend: '/app/xw-ticket/images/border/vend.png'
    blank: '/app/xw-ticket/images/val/blank.png'
    undefined: '/app/xw-ticket/images/val/blank.png'
  }

  xwModule.filter 'xwCellBorder', ['xwBorderImageHash', (xwBorderImageHash) ->
    return (cellModel) ->
      if !cellModel?
        borderState = undefined
      else
        borderState = cellModel.borderState? || undefined
      return xwBorderImageHash[borderState] || xwBorderImageHash.undefined
  ]

  xwModule.value 'xwFillImageHash', {
    revealed: '/app/xw-ticket/images/fill/brite1.png'
    selected: '/app/xw-ticket/images/fill/selected1.png'
    triple: '/app/xw-ticket/images/fill/imageSrc.png'
    blocked: '/app/xw-ticket/images/fill/locked.png'
    tooshort: '/app/xw-ticket/images/fill/altPath.png'
    tripshort: '/app/xw-ticket/images/fill/golden.png'
    dualtrip: '/app/xw-ticket/images/fill/cornsilk.png'
    dualtripshort: '/app/xw-ticket/images/fill/briteblue.png'
    baseline: '/app/xw-ticket/images/fill/pink2.png'
    undefined: '/app/xw-ticket/images/fill/pink2.png'
  }

  xwModule.filter 'xwCellFill', ['xwFillImageHash', (xwFillImageHash) ->
    return (cellModel) ->
      if !cellModel?
        fillState = undefined
      else
        fillState = cellModel.fillState? || undefined
      return xwFillImageHash[fillState] || xwFillImageHash.undefined
  ]

  xwModule.controller 'CrosswordCtrl', ['$scope', 'xwDocumentFactory', 'xwReportService', ($scope, xwDocumentFactory, xwReportService) ->
    $scope.documentModel = xwDocumentFactory.newTripleNoTwentyTicketDocument('858:323842-049', 'tripleNoTwenty')

    updateProgressReportFn = (nextReportModel) ->
      $scope.progressModel = nextReportModel
      # nextReportModel.updatePromise.then updateProgressReportFn
      return nextReportModel
    updateProgressReportFn xwReportService.getProgressReport()

    updatePayoutModelFn = (nextReportModel) ->
      $scope.payoutModel = nextReportModel
      # nextReportModel.updatePromise.then updatePayoutModelFn
      return nextReportModel
    updatePayoutModelFn xwReportService.getPayoutReport()

    $scope.alert = window.alert
  ]

  class XwModelFactory
    # Given a TicketDocument, produce a TicketModel equivalent suitable for the editor directive at the heart of this
    # module.
    createModelFromDocument: (ticketDocument) ->
      # Populate the cells for each grid model--an 11x11 square
      ii = 0
      kk = 0
      xwCells = new Array(121)
      while ii < 11
        jj = 0
        while jj < 11
          xwCells[kk] = new GenericCellModel(kk, ii, jj, ticketDocument.content.charAt(kk))
          jj = jj + 1
          kk = kk + 1
        # Advance the row counter.
        ii = ii + 1

      #
      # Your Letters Grid
      #
      ii = 0
      kk = 0
      ylCells = new Array(18)
      while ii < 3
        jj = 0
        while jj < 6
          ylCells[kk] = new GenericCellModel(kk, ii, jj, ticketDocument.yourLetters.charAt(kk))
          jj = jj + 1
          kk = kk + 1
        ii = ii + 1

      #
      # Bonus Word Grid
      #
      if ticketDocument.bonusWord?
        ii = 0
        bwCells = new Array(5)
        while ii < 5
          bwCells[ii] = new GenericCellModel(ii, 0, ii, ticketDocument.bonusWord.charAt(ii) || '_')
          ii = ii + 1
      else
        bwCells = new Array[0]

      return new EditorTicketModel(
        ticketDocument.ticketId
        xwCells
        ticketDocument.content.split('')
        ylCells
        ticketDocument.yourLetters.split('')
        if ticketDocument.bonusWord? then bwCells else null
        if ticketDocument.bonusWord? then ticketDocument.bonusWord.split('') else null
      )

  xwModule.service('xwModelFactory', [XwModelFactory])

  ##
  ## Ticket Model Classes
  ##

  class EditorTicketModel
    constructor: (
      ticketId, crosswordGrid, crosswordArray, yourLettersGrid, yourLettersArray, bonusWordGrid, bonusWordArray
    ) ->
      @ticketId = ticketId
      @crosswordGrid = crosswordGrid
      @crosswordArray = crosswordArray
      @yourLettersGrid = yourLettersGrid
      @yourLettersArray = yourLettersArray
      @bonusWordGrid = bonusWordGrid
      @bonusWordArray = bonusWordArray

      @revealedLetters = {}
      @bonusLetters = {}

      return @

  class GenericCellModel
    constructor: (@indexId, @rowId, @colId, storedContent) ->
      @coordinates = rowId + ',' + colId
      @cellContent = storedContent.toLowerCase()
      @hasModifier = @cellContent != storedContent
      @borderState = 'blank'
      @fillState   = 'blank'

      return @

  class OrientationKind
    @HORIZONTAL = new OrientationKind( {
        head: 'htop',
        mid:  'hmid',
        tail: 'hend'
      },
      ['toLeft', 'toRight']
      'rowWord'
      'colWord'
      () -> return OrientationKind.VERTICAL
    )
    @VERTICAL = new OrientationKind( {
        head: 'vtop',
        mid:  'vmid',
        tail: 'vend'
      },
      ['toAbove', 'toBelow']
      'colWord'
      'rowWord'
      () -> return OrientationKind.HORIZONTAL
    )

    constructor: (@labels, @toNeighbors, @toDirectWord, @toAltWord, @oppositeFn) ->
      return @

    getBorderHead: () -> return @labels.head
    getBorderMiddle: () -> return @labels.mid
    getBorderTail: () -> return @labels.tail
    changeOrientation: () -> return @oppositeFn()
    @getAll: () => return [@HORIZONTAL, @VERTICAL]

  class CellStateKind
    constructor: (fillImageKey) ->
      @fillImageKey = fillImageKey
      return @

    # The next four states are used for the cells of a grid that is not reachable by a currently open edit cursor.
    #
    # The BonusWord grid uses @COVERED for all cells whose value has not yet been discovered in YourLetters and
    # @MATCHED for those whose value has.  BonusWord does not use @BLOCKED or @REVEALED.
    #
    # The YourLetters grid uses @COVERED for all cells with no value assigned and @REVEALED for all cells whose
    # letter value has been discovered.
    #
    # The CrosswordGrid uses @COVERED and @MATCHED
    @COVERED          = new CellStateKind('baseline')
    @MATCHED          = new CellStateKind('revealed')
    @BLOCKED          = new CellStateKind('blocked')
    @REVEALED         = new CellStateKind('revealed')

    @ERROR            = new CellStateKind('tooshort')

    # @REACHABLE and @SELECTED define the location of cursors on an actively open grid.
    #
    # For BonusWord and YourLetters, all cells become @REACHABLE when the grid is active.
    #
    # For Crossword, any cell where cursor can be moved without being unable to leave the grid in a valid state
    # is reachable.  Any edit in the reachable space has a potential to leave short 1-letter or 2-letter words that
    # are not legal.  Cell border highlighting is used instead of fill colors to convey the location and completion
    # requirements of words in the current cursor's reach.  See {TODO} for a more complete discussion on the designed
    # use of cell boundary highlighting.
    @REACHABLE        = new CellStateKind('selected')
    @SELECTED         = new CellStateKind('active')
    @DIRTY            = new CellStateKind('dirtyTBD')

    getImageKey: () -> return @fillImageKey

  class CellErrorKind
    @ONE_LETTER_WORD = new CellErrorKind('Isolated letter tiles are not allowed.  Letters tiles must be adjacent to enough other letters tiles to create at least one three letter word.')
    @TWO_LETTER_WORD = new CellErrorKind('Two letter words are not allowed.  Adjacent letter tiles define words, but all words must have at least three letters in length.')
    @WORD_TOO_LONG = new CellErrorKind('The maximum legal word length is 9 letters.  This cell is part of a word that has 10 or 11 letters.')
    @FULL_QUAD = new CellErrorKind('No more than 3 of the 4 tiles from any 2x2 subunit may validly contain a letter')
    @AMBIGUOUS_TRIPLE = new CellErrorKind('Triple bonus modifiers may not placed at the shared intersection between two distinct words.')
    @TOO_MANY_TRIPLES = new CellErrorKind('Exactly four cells are required to contain triple modifiers, but too many are in use.  Reduce the number to four.')
    @MISSING_BONUS_LETTER = new CellErrorKind('The bonus word must contain exactly five letters, but fewer than five have been given.')
    @REUSED_BONUS_LETTER = new CellErrorKind('No two letters of the bonus word can be the same.  All five letters must be unique.')

    constructor: (@toolTipMessage) -> return @

  class TicketErrorKind
    @MISSING_IDENTITY = new TicketErrorKind('The ticket\'s identifier has not been set.  Identifiers require a three digit gameId, a colon ( =), a 6 or 7 digit spoolId, a dash (-), then a three digit ticketId.')
    @INVALID_IDENTITY = new TicketErrorKind('The ticket\'s identifier is malformed.  Identifiers require a three digit gameId, a colon ( =), a 6 or 7 digit spoolId, a dash (-), then a three digit ticketId.')
    @TOO_MANY_WORDS = new TicketErrorKind('The crossword grid must contain exactly 22 words, 11 horizontal and 11 vertical.  There are too many words right now for this ticket to be played.')
    @NOT_ENOUGH_WORDS = new TicketErrorKind('The crossword grid must contain exactly 22 words, 11 horizontal and 11 vertical.  There aren\'t enough words yet for this ticket to be played.')
    @NOT_ENOUGH_TRIPLES = new TicketErrorKind('The crossword grid must contain exactly four tripling modifiers, each of which must be in a cell that is part of only one word.  More triple modifiers are required before this ticket can be played.')
    @NO_BONUS_WORD = new TicketErrorKind('The bonus word content is still undefined and is required before this ticket can be played.');
    @NO_BONUS_VALUE = new TicketErrorKind('The bonus word\'s prize value is required before this ticket can be marked as complete.')
    @BAD_BONUS_VALUE = new TicketErrorKind('The bonus word\'s prize value is set to unusable value and must be changed.');
    @TWENTY_SPOT_UNDEFINED = new TicketErrorKind('The presence or omission of a "fast twenty" spot must be clarified before this ticket can be played.')
    @NO_VALID_OUTCOME = new TicketErrorKind('There is no permutation of available letters left that yields either a non-winner or valid payout result.')

    constructor: (@toolTipMessage) -> return @



#    # Each subtype will want to override this method--they each have different business logic surrounding fill states
#    setInactiveFillState: () ->
#      if @isBlank()
#        @fillState = CellStateKind.COVERED.getImageKey()
#      else if @isBlocked()
#        @fillState = CellStateKind.BLOCKED.getImageKey()
#      else if @hasError()
#        @fillState = CellStateKind.ERROR.getImageKey()
#      else if @hasMatchedContent()
#        @fillState = CellStateKind.MATCHED.getImageKey()
#      else
#        @fillState = CellStateKind.COVERED.getImageKey()
#
#      return
#
#    # Each subtype will want to override this method--they each have different business logic surrounding borders
#    getBorder: () -> return 'blank'
#
#    # Each subtype SHOULD override these to define forward/backward navigation and boundaries
#    getNextCell: () -> return @
#    getPreviousCell: () -> return @



#  class BonusWordCell extends GenericCellModel
#
#    getBorder: () ->
#      retVal = 'blank'
#      if (@parentGrid.parentTicket.cursorCell == this)
#        switch(@colId)
#          when 0
#            retVal = OrientationKind.HORIZONTAL.getBorderHead()
#          when 4
#            retVal = OrientationKind.HORIZONTAL.getBorderTail()
#          else
#            retVal = OrientationKind.HORIZONTAL.getBorderMiddle()
#
#      return retVal




  #
  # Main Crossword Grid and Cell
  #
#  class CrosswordGrid extends AbstractGridModel
#
#    constructor: (cells) ->
#      @orientation = OrientationKind.HORIZONTAL
#      super 'crossword', 11, 11, cells
#
#      return @
#
#    toggleOrientation: () ->
#      @orientation = @orientation.getOpposite()
#
#    ##
#    ## Cursor based key stroke handlers
#    handleAlpha: (targetCell, inputValue) ->
#      nextCell = @
#      editAnalysis = @isInputValid(targetCell, inputValue)
#      if editAnalysis == false
#        retVal = [OnHandleEventAction.NO_ACTION]
#      else
#        @setContentValue(targetCell, inputValue)
#        nextCell = targetCell.getNextCell()
#        if (nextCell != @)
#          retVal = [OnHandleEventAction.MOVE_CURSOR, nextCell]
#        else
#          retVal = [OnHandleEventAction.NO_ACTION]
#
#      return retVal
#
#    handleBackspace: (targetCell) ->
#      this.setContentValue(targetCell, '_')
#      return [OnHandleEventAction.NO_ACTION]
#
#    handleLeftArrow: (targetCell) ->
#      return [OnHandleEventAction.MOVE_CURSOR, targetCell.getPreviousCell()]
#    handleRightArrow: (targetCell) ->
#      return [OnHandleEventAction.MOVE_CURSOR, targetCell.getNextCell()]
#    handleUpArrow: (targetCell) ->
#      return [OnHandleEventAction.NO_ACTION]
#    handleDownArrow: (targetCell) ->
#      return [OnHandleEventAction.NO_ACTION]
#
#    handleEscape: (targetCell) ->
#      return [OnHandleEventAction.CLOSE, false]
#    handleEnter: (targetCell) ->
#      return [OnHandleEventAction.CLOSE, true]
#    handleTab: (targetCell) ->
#      return [OnHandleEventAction.NO_ACTION]
#
#    handleKeyPress: (value) ->
#      legalValue = @getLegalValue value
#      if (legalValue?)
#        @content = legalValue.toLowerCase()
#        if (legalValue != @content)
#          @isTriple = true
#        else
#          @isTriple = false
#
#      nextCell = @getNextCell()
#      if (nextCell?)
#        retVal = [OnHandleEventAction.MOVE_CURSOR, nextCell]
#      else
#        retVal = [OnHandleEventAction.NO_ACTION]
#
#      return retVal
#
#    getNextCell: () -> return @getToRight()
#    getPreviousCell: () -> return @getToLeft()
#
#    getBorder: () ->
#      retVal = 'blank'
#      if (false)
#        retVal = @orientation.getHeadBorder()
#      else if (false)
#        retVal = @orientation.getTailBorder()
#      else if (
#        false &&
#        (forCellModel.parentGrid == @wordLeft?.parentGrid) &&
#        (forCellModel.parentGrid == @wordRight?.parentGrid) &&
#        (forCellModel.getRelRowId() == @wordLeft.getRelRowId()) &&
#        (forCellModel.getRelRowId() == @wordRight.getRelRowId()) &&
#        (forCellModel.getRelColId() > @wordLeft.getRelColId()) &&
#        (forCellModel.getRelColId() < @wordRight.getRelColId())
#      )
#        # The complex-looking test above passes if forCellModel, wordLeft, and wordRight
#        # all belong to the same orientation-aware row of the same grid and forCellModel's
#        # orientation-aware column is both to wordLeft's right and to wordRight's left.
#        retVal = @orientation.getMidBorder()
#
#      return retVal.imageKey

  return xwModule
