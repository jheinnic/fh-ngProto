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

  keyHandlerNoop = ($event) -> return

  xwModule.directive 'xwTicket', [
    'xwModelFactory', 'keypressHelper', 'valueImages', 'borderImages', 'fillImages', (xwModelFactory, keypressHelper, valueImages, borderImages, fillImages) ->
      restrict: 'E'
      replace: true
      scope:
        ticketDocument: '='
#        onDescripion: '&'
#        onDiscovery: '&'
#        onComplete: '&'

      templateUrl: '/app/xw-ticket/partials/xwTicket.html',
      controller: ['$scope', '$element', ($scope, $element) ->
        #$scope.cursorKeyHandler = keyHandlerNoop;

        # ** closeCursor(), openCursor(), and moveCursor() **
        # Private cursor management functions that carry out a cursor state change requested by the underlying model
        # (hence presumed to be correct and formed with valid arguments--no "are you sure" or null input verification
        # by-design.
        activeCursorKeyPressHandlers = {
          'a b c d e f g h i j k l m n o p q r s t u v w x y z': 'handleAlpha($event)'
          'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z': 'handleAlpha($event)'
          'enter': 'handleEnter($event)'
        };
        activeCursorKeyDownHandlers = {
          '*': 'tempTest("Asterisk", $event)'
          'up': 'handleUpArrow($event)'
          'esc': 'handleEscape($event)'
          'tab': 'handleTab($event)'
          'left': 'handleLeftArrow($event)'
          'down': 'handleDownArrow($event)'
          'right': 'handleRightArrow($event)'
          'alt-tab': 'tempTest("alt-tab", $event)'
          'ctrl-tab': 'tempTest("ctrl-tab", $event)'
          'home-end': 'tempTest("home-end", $event)'
          'shift-tab': 'tempTest("shift-tab", $event)'
          'alt-space': 'tempTest("alt-space", $event)'
          'ctrl-space': 'tempTest("ctrl-space", $event)'
          'ctrl-alt-esc': 'tempTest("ctrl-alt-esc", $event)'
          'ctrl-alt-space': 'tempTest("ctrl-alt-space", $event)'
          'alt-shift-space': 'tempTest("alt-shift-space", $event)'
          'backspace delete': 'handleBackspace($event)'
          'ctrl-shift-space': 'tempTest("ctrl-shift-space", $event)'
          'ctrl-alt-shift-space': 'tempTest("ctrl-alt-shift-space", $event)'
        };
        activeKeyPressHandler = keypressHelper($scope, activeCursorKeyPressHandlers)
        activeKeyDownHandler  = keypressHelper($scope, activeCursorKeyDownHandlers)

        closeCursor = (withCommit) ->
          tempCell = $scope.ticketModel.cursorCell
          # $scope.cursorKeyHandler = keyHandlerNoop
          $scope.ticketModel.cursorCell = null
          tempCell.handleCloseCursor(withCommit)
          return

        openCursor = (targetCell) ->
          targetGrid = targetCell.parentGrid
          $scope.ticketModel.cursorCell = targetCell
          targetCell.handleOpenCursor()
          # $scope.cursorKeyHandler = activeKeyHandler
          return

        moveCursor = (targetCell) ->
          tempCell = $scope.ticketModel.cursorCell
          tempCell.handleReleaseCursorTo targetCell
          $scope.ticketModel.cursorCell = targetCell
          targetCell.handleReceiveCursorFrom tempCell
          return

        # ** onCellClick() and onKeyPress() **
        # Validation of user input occurs in the
        # DOM event handlers that call these methods post-validation: 'onCellClick' and 'onKeyPress'.
        $scope.onCellClick = (cellModel, $event) ->
          handleResponseAction cellModel.handleCellClick()
          $event.preventDefault()
          return

        getCursorCell = () -> return $scope.ticketModel.cursorCell

        $scope.handleAlpha = ($event) ->
          inputChar = String.fromCharCode($event.keyCode).toLowerCase()
          console.log('Key Press: ' + inputChar)
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          $event.preventDefault()
          handleResponseAction cursorGrid.handleAlpha(cursorCell, inputChar)

        $scope.handleBackspace = ($event) ->
          console.log('Backspace Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleBackspace(cursorCell)

        $scope.handleLeftArrow = ($event) ->
          console.log('Left Arrow Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleLeftArrow(cursorCell)

        $scope.handleRightArrow = ($event) ->
          console.log('Right Arrow Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleRightArrow(cursorCell)

        $scope.handleUpArrow = ($event) ->
          console.log('Up Arrow Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleUpArrow(cursorCell)

        $scope.handleDownArrow = ($event) ->
          console.log('Down Arrow Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleDownArrow(cursorCell)

        $scope.handleEscape = ($event) ->
          console.log('Escape Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleEscape(cursorCell)

        $scope.handleEnter = ($event) ->
          console.log('Enter Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleEnter(cursorCell)

        $scope.handleTab = ($event) ->
          console.log('Tab Press')
          $event.preventDefault()
          cursorCell = getCursorCell()
          cursorGrid = cursorCell.parentGrid
          handleResponseAction cursorGrid.handleTab(cursorCell)

        $scope.tempTest = (str, $event) ->
          console.log 'Temporary test called with: ' + str
          $event.preventDefault()
          console.log $event

        handleResponseAction = (responseAction) ->
          if (responseAction? && responseAction instanceof Array && responseAction.length > 0)
            switch (responseAction[0])
              when OnHandleEventAction.NO_ACTION
                angular.noop()
              when OnHandleEventAction.MOVE_CURSOR
                moveCursor responseAction[1]
              when OnHandleEventAction.OPEN_CURSOR
                if ($scope.ticketModel.cursorCell?)
                  closeCursor responseAction[1]
                openCursor responseAction[2]
              when OnHandleEventAction.CLOSE
                closeCursor responseAction[1]
              else
                suffixStr = ' returned by cell click event handler'
                if (responseAction.length > 1)
                  suffixStr = ', with additional arguments ' + responseAction.slice(1).toString() + suffixStr
                throw 'IllegalStateException -- Unknown response action type ' + responseAction[0] + suffixStr
          else
            throw 'IllegalStateException: Non-array or empty-array ' + responseAction?.toString() + ' returned by cell click event handler'

        # This is also likely to vanish in favor of $rootScope.$broadcast('updateNotice')
        this.purgeWordList = () ->
          $scope.dataReportingModel.purgeWordList()
          return

        this.purgeLetterList = () ->
          $scope.dataReportingModel.revealedLetters = []
          $scope.dataReportingModel.purgedLetters = true
          return

        this.updateReportingService = () ->
          return

        $scope.ticketModel = xwModelFactory.createModelFromDocument $scope.ticketDocument
        $scope.imageModel =
          fillImages: fillImages
          valueImages: valueImages
          borderImages: borderImages
        $scope.dataReportingModel = 'TBD'

        $element.on 'keypress', ($event) ->
          activeKeyPressHandler($event)
          return
        $element.on 'keydown', ($event) ->
          activeKeyDownHandler($event)
          return

        return this
      ]
  ]

  xwModule.directive 'xwBonusValueCell', () ->
    restrict: 'E'
    replace: true
    require: '^xwTicket'
    scope: false
    templateUrl: '/app/xw-ticket/partials/bonusValueCell.html'

  xwModule.directive 'xwYourLettersGrid', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.gridDirective('yourLetters')
  ]

  xwModule.directive 'xwYourLettersCell', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.cellDirective('yourLetters')
  ]

  xwModule.directive 'xwBonusWordGrid', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.gridDirective('bonusWord')
  ]

  xwModule.directive 'xwBonusWordCell', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.cellDirective('bonusWord')
  ]

  xwModule.directive 'xwCrosswordGrid', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.gridDirective('crossword')
  ]

  xwModule.directive 'xwCrosswordCell', ['xwDirectiveFactory', (xwDirectiveFactory) ->
    return xwDirectiveFactory.cellDirective('crossword')
  ]

  xwModule.directive 'xwBonusValue', () ->
    restrict: 'E'
    replace: true
    require: '^xwTicket'
    scope: false
    templateUrl: '/app/xw-ticket/partials/bonusValue.html'

  xwModule.value 'valueImages', {
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
    A: '/app/xw-ticket/images/gval/A.png'
    B: '/app/xw-ticket/images/gval/B.png'
    C: '/app/xw-ticket/images/gval/C.png'
    D: '/app/xw-ticket/images/gval/D.png'
    E: '/app/xw-ticket/images/gval/E.png'
    F: '/app/xw-ticket/images/gval/F.png'
    G: '/app/xw-ticket/images/gval/G.png'
    H: '/app/xw-ticket/images/gval/H.png'
    I: '/app/xw-ticket/images/gval/I.png'
    J: '/app/xw-ticket/images/gval/J.png'
    K: '/app/xw-ticket/images/gval/K.png'
    L: '/app/xw-ticket/images/gval/L.png'
    M: '/app/xw-ticket/images/gval/M.png'
    N: '/app/xw-ticket/images/gval/N.png'
    O: '/app/xw-ticket/images/gval/O.png'
    P: '/app/xw-ticket/images/gval/P.png'
    Q: '/app/xw-ticket/images/gval/Q.png'
    R: '/app/xw-ticket/images/gval/R.png'
    S: '/app/xw-ticket/images/gval/S.png'
    T: '/app/xw-ticket/images/gval/T.png'
    U: '/app/xw-ticket/images/gval/U.png'
    V: '/app/xw-ticket/images/gval/V.png'
    W: '/app/xw-ticket/images/gval/W.png'
    X: '/app/xw-ticket/images/gval/X.png'
    Y: '/app/xw-ticket/images/gval/Y.png'
    Z: '/app/xw-ticket/images/gval/Z.png'
    _: '/app/xw-ticket/images/val/blank.png'
    cursor: '/app/xw-ticket/images/val/qm.png'
    blank: '/app/xw-ticket/images/val/blank.png'
    undefined: '/app/xw-ticket/images/val/blank.png'
  }

  xwModule.value 'borderImages', {
    htop: '/app/xw-ticket/images/border/htop.png'
    hmid: '/app/xw-ticket/images/border/hmid.png'
    hend: '/app/xw-ticket/images/border/hend.png'
    vtop: '/app/xw-ticket/images/border/vtop.png'
    vmid: '/app/xw-ticket/images/border/vmid.png'
    vend: '/app/xw-ticket/images/border/vend.png'
    blank: '/app/xw-ticket/images/val/blank.png'
    undefined: '/app/xw-ticket/images/val/blank.png'
  }

  xwModule.value 'fillImages', {
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

  xwModule.controller 'CrosswordCtrl', ['$scope', 'xwDocumentFactory', 'xwReportSvc', ($scope, xwDocumentFactory, xwReportSvc) ->
    $scope.documentModel = xwDocumentFactory.newTripleNoTwentyTicketDocument('858:323842-049', 'tripleNoTwenty')

    updateProgressReportFn = (nextReportModel) ->
      $scope.progressModel = nextReportModel
      # nextReportModel.updatePromise.then updateProgressReportFn
      return nextReportModel
    updateProgressReportFn xwReportSvc.getProgressReport()

    updatePayoutModelFn = (nextReportModel) ->
      $scope.payoutModel = nextReportModel
      # nextReportModel.updatePromise.then updatePayoutModelFn
      return nextReportModel
    updatePayoutModelFn xwReportSvc.getPayoutReport()

    $scope.alert = window.alert
  ]

  class XwModelFactory
    # Given a TicketDocument, produce a TicketModel equivalent suitable for the editor directive at the heart of this
    # module.
    createModelFromDocument: (ticketDocument) ->
      # Populate the cells for each grid model--an 11x11 square
      ii = 0
      kk = 0
      nextCell = null
      firstRowCell = null
      cells = new Array(121)
      while ii < 11
        lastCellAbove = firstRowCell
        lastCellLeft  = null
        jj            = 0
        while jj < 11
          nextCell = new FixedCell(kk, ii, jj, ticketDocument.content.charAt(kk))
          cells[kk] = nextCell

          if(lastCellLeft == null)
            # Remember the start of the present row so we can use it to set above/below links
            # when we start the next row.
            firstRowCell  = nextCell
          else
            # Use the previous allocation reference to set left/right links.
            nextCell.aligned.toLeft       = lastCellLeft
            lastCellLeft.aligned.toRight  = nextCell
            nextCell.rotated.toAbove      = lastCellLeft
            lastCellLeft.rotated.toBelow  = nextCell

          if(lastCellAbove != null)
            # Use a walk of the previous row to set above/below links
            nextCell.rotated.toLeft       = lastCellAbove
            lastCellAbove.rotated.toRight = nextCell
            nextCell.aligned.toAbove      = lastCellAbove
            lastCellAbove.aligned.toBelow = nextCell

          # Keep this cell as the previous allocation of the current row.  Use the left/right
          # navigability built when processing the previous row to advance the lastRow pointer
          # one cell to the right.  This prepares us for linking the left/up navigation for the
          # upcoming next allocation.  Advance the column and flattened index counters.
          lastCellLeft = nextCell
          lastCellAbove = lastCellAbove?.aligned.toRight || null
          jj = jj + 1
          kk = kk + 1
        # Advance the row counter.
        ii = ii + 1

      crosswordGrid = new CrosswordGrid(cells)

      #
      # Your Letters Grid
      #
      ii = 0
      kk = 0
      nextCell = null
      cells = new Array(18)
      while ii < 3
        lastCellLeft  = null
        jj            = 0
        while jj < 6
          nextCell = new YourLettersCell(kk, ii, jj, ticketDocument.yourLetters.charAt(kk))
          cells[kk] = nextCell

          if (lastCellLeft == null)
            if (ii==0)
              firstRowCell = nextCell
          else
            lastCellLeft.next = nextCell
            nextCell.prev = lastCellLeft

          lastCellLeft = nextCell
          jj = jj + 1
          kk = kk + 1
        ii = ii + 1

      # Establish circular navigation.  Link last.next to first.  Link first.prev to last.
      firstRowCell.prev = nextCell
      nextCell.next = firstRowCell
      yourLettersGrid = new YourLettersGrid(cells)

      #
      # Bonus Word Grid
      #
      ii = 0
      nextCell = null
      lastCellLeft = null
      cells = new Array(5)
      while ii < 5
        nextCell = new BonusWordCell(ii, ticketDocument.variantData.bonusWord?.charAt(ii) || '_')
        cells[ii] = nextCell

        if lastCellLeft == null
          firstRowCell = nextCell
        else
          lastCellLeft.next = nextCell
          nextCell.prev = lastCellLeft
        lastCellLeft = nextCell
        ii = ii + 1

      # Establish circular navigation.  Link last.next to first.  Link first.prev to last.
      firstRowCell.prev = nextCell
      nextCell.next = firstRowCell
      bonusWordGrid = new BonusWordGrid(cells)

      return new TripleNoTwentyTicketModel(ticketDocument.ticketId, ticketDocument.actualPayout, crosswordGrid, yourLettersGrid, bonusWordGrid)

  xwModule.service('xwModelFactory', [XwModelFactory])

  ##
  ## Ticket Model Classes
  ##

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

  class LifecycleStage
    constructor: (@canEditDescription, @canEditDiscoveries) ->
      return @

    @DESCRIBING = new LifecycleStage(true, false)
    @PLAYING =  new LifecycleStage(false, true)
    @PUBLISHED = new LifecycleStage(false, false)

    isCrosswordGridEditable:       () -> return @canEditDescription
    isBonusWordGridEditable:       () -> return @canEditDescription
    isBonusWordValueEditable:      () -> return @canEditDiscoveries
    isMultiplierEditable:          () -> return @canEditDiscoveries
    isTwentySpotEditable:          () -> return @canEditDiscoveries
    isYourLetterGridEditable:      () -> return @canEditDiscoveries

    areReportsUpdatable:           () -> return @canEditDiscoveries

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

  class AbstractTicketModel
    cursorCell: null
    ticketErrors: {}

    constructor: (@ticketId, @payoutValue, @crosswordGrid, @yourLettersGrid) ->
      # if (TicketModel.identityRegex.test(@ticketId) == false)
      #   throw 'Invalid argument exception!'

      crosswordGrid.parentTicket = @
      yourLettersGrid.parentTicket = @

      # TODO: This needs to be more dynamic

      @lifecycleStage = LifecycleStage.DESCRIBING
      return @

    ##
    ## Queries
    ##

    isCursorCell: (cellQuery) ->
      return @cursorCell == cellQuery

    isMatchedLetter: (letterQuery) ->
      return @yourLettersGrid.isLetterUsed(letterQuery)

    isTripleBonusUsed: () -> return undefined;

    isDescriptionComplete: () ->
      return @crosswordGrid.isComplete()

    isDiscoveryComplete: () ->
      return @yourLettersGrid.isComplete()

    mayChangeLifecycle: (toStage) ->
      switch @lifecycleStage
        when LifecycleStage.DESCRIBING
          if (toStage == LifecycleStage.DESCRIBING)
            return true
          else if(toStage == LifecycleStage.PLAYING)
            return isDescriptionComplete()
          else if(toStage == LifecycleStage.PUBLISHED)
            return isDescriptionComplete() && isDiscoveryComplete()
        when LifecycleStage.PLAYING
          if (toStage == LifecycleStage.DESCRIBING)
            return true
          else if (toStage == LifecycleStage.PLAYING)
            return true
          else if (toStage == LifecycleStage.PUBLISHED)
            return isDiscoveryComplete()
        when LifecycleStage.PUBLISHED
          return true
        else

      return false

    ##
    ## Mutators
    ##

    setLifecycleStage: (nextLifecycleStage) ->
      retVal = nextLifecycleStage
      if @mayAdvanceLifecycle(nextLifecycleStage)
        @lifecycleStage = nextLifecycleStage
      else
        retVal = @lifecycleStage
      return @

    # TODO: Confirm the min/max valid values
    setPayoutValue: (newValue) ->
      if (!@lifecycleStage.isPayoutValueEditable())
        throw 'IllegalState'
      if (((typeof newValue) != 'number') || newValue < 0 || newValue > 17)
        throw 'IllegalArgument'

      @setPayoutValue = newValue
      return @

  class TripleNoTwentyTicketModel extends AbstractTicketModel
    constructor: (ticketId, payoutValue, crosswordGrid, yourLettersGrid, @bonusWordGrid, @bonusValue) ->
      super(ticketId, payoutValue, crosswordGrid, yourLettersGrid)
      bonusWordGrid.parentTicket = @
      return @

    ##
    ## Queries
    ##

    isDescriptionComplete: () ->
      return super() && @bonusWordGrid.isComplete()

    isDiscoveryComplete: () ->
      return super() && @bonusValue != null

    isTripleBonusUsed: () -> return true;

    isBonusLetter: (letterQuery) ->
      return @bonusWordGrid.isLetterUsed(letterQuery)

    ##
    ## Mutators
    ##

    setBonusWordValue: (newValue) ->
      if !@lifecycleStage.isBonusWordValueEditable()
        throw 'IllegalState'
      if ((typeof newValue) != 'number') || newValue < 0 || newValue > 3
        throw 'IllegalArgument'

      @bonusValue = newValue
      return @

  class TripleWithSpotTicketModel extends AbstractTicketModel
    constructor: (ticketId, payoutValue, crosswordGrid, yourLettersGrid, @bonusWordGrid, @bonusValue, @spotValue) ->
      super(ticketId, payoutValue, crosswordGrid, yourLettersGrid)
      bonusWordGrid.parentTicket = @
      return @

    ##
    ## Queries
    ##

    isDescriptionComplete: () ->
      return super() && @bonusWordGrid.isComplete()

    isDiscoveryComplete: () ->
      return super() && @bonusValue != null && isTwentySpotRevealed()

    isTripleBonusUsed: () -> return true;

    isBonusLetter: (letterQuery) ->
      return @bonusWordGrid.isLetterUsed(letterQuery)

    isTwentySpotRevealed: () ->
      return @spotValue > -1

    isTwentySpotWon: () ->
      if @spotValue == -1
        retVal = undefined
      else
        retVal = @spotValue == 20

      return retVal

    ##
    ## Mutators
    ##

    setBonusWordValue: (newValue) ->
      if !@lifecycleStage.isBonusWordValueEditable()
        throw 'IllegalState'
      if ((typeof newValue) != 'number') || newValue < 0 || newValue > 3
        throw 'IllegalArgument'

      @bonusValue = newValue
      return @

    setSpotValue: (newValue) ->
      if !@lifecycleStage.isTwentySpotEditable()
        throw 'IllegalState'
      if ((typeof newValue) != 'number') || newValue < 0 || newValue > 30
        throw 'IllegalArgument'

      @spotValue = newValue
      return @

  class FiveXTicketModel extends AbstractTicketModel
    constructor: (ticketId, payoutValue, crosswordGrid, yourLettersGrid, @multiValue, @spotValue) ->
      super(ticketId, payoutValue, crosswordGrid, yourLettersGrid)
      return @

    ##
    ## Queries
    ##

    isDiscoveryComplete: () ->
      return super() && isTwentySpotRevealed() && isMultiplierRevealed()

    isTripleBonusUsed: () -> return false;

    isMultiplierRevealed: () ->
      return @multiValue != null

    getMultiplier: () ->
      if multiValue == null
        retVal = undefined
      else
        retVal = @multiValue

      return retVal

    isTwentySpotWon: () ->
      if @spotValue == null
        retVal = undefined
      else
        retVal = @spotValue == 20

      return retVal

    ##
    ## Mutators
    ##

    # Multiplier is 1x, 2x, 4x, or 5x.  TODO: Confirm
    setMultplierValue: (newValue) ->
      if !@lifecycleStage.isMultiplierEditable()
        throw 'IllegalState'
      if ((typeof newValue) != 'number') || newValue < 1 || newValue == 3 || newValue > 5
        throw 'IllegalArgument'

      @bonusValue = newValue
      return @

    setSpotValue: (newValue) ->
      if !@lifecycleStage.isTwentySpotEditable()
        throw 'IllegalState'
      if ((typeof newValue) != 'number') || newValue < 0 || newValue > 30
        throw 'IllegalArgument'

      @spotValue = newValue
      return @


  # Every handleX() method returns an array describing the caller's requested next
  # action.  The first element is a value from this array, which both defines the
  # next requested action and how the remaining array elements shape that request
  # (e.g. the next element of a @MOVE_CURSOR reply identifies the target cell
  class OnHandleEventAction
    @NO_ACTION = 'NoAction'
    @MOVE_CURSOR = 'MoveCursor'
    @OPEN_CURSOR = 'OpenCursor'
    @CLOSE_CURSOR = 'CloseCursor'
    @ROLLBACK = 'Rollback'

  NOT_BLANK_CHARS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ]
  STORABLE_CHARS = NOT_BLANK_CHARS.concat('_')

  class AbstractGridModel
    dirtyCells: new Array()

    constructor: (@gridKind, @numRows, @numCols, @cells) ->
      @numCells   = numRows*numCols
      if (cells.length != @numCells)
        throw 'IllegalArgument: cells.length = ' + cells.length + ', @numRows = ' + numRows + ', @numCols = ' + numCols

      # A hash from character to an array of cells whose content is set to that character.
      contentMap = {}
      STORABLE_CHARS.forEach( (nextChar) -> contentMap[nextChar] = [] )

      parentGrid = @
      cells.forEach( (cellModel) ->
        value = cellModel.content
        if (value != '_')
          value = value.toLowerCase()

        contentMap[value].push cellModel
        cellModel.setParentGrid parentGrid
        return
      )
      @contentMap = contentMap
      return @

    # Regular expressions with the range of legally stored values for @content across all subtypes.
    @isStorableRegex: /^[a-z_]$/
    @notBlankRegex: /^[a-zA-Z]$/

    ##
    ## Cell retrieval
    getCellByCoordinates: (rowId, colId) ->
      if (rowId < 0 || rowId >= @numRows)
        throw 'IllegalArgument: rowId = ' + rowId
      if (colId < 0 || colId >= @numCols)
        throw 'IllegalArgument: colId = ' + colId

      return @cells[colId + (rowId*@numRows)]

    getCellsByContent: (value) ->
      if (!AbstractGridModel.isStorableRegex.test(value))
        throw 'IllegalArgument: value = ' + value

      return clone @contentMap[value]

    isLetterUsed: (letterQuery) ->
      if (!AbstractGridModel.isStorableRegex.test(letterQuery))
        throw 'IllegalArgument: letterQuery = ' + letterQuery

      return @getCellsByContent(letterQuery).length >= 1

    # TODO: MAY override this if lifecycle state advancement does not depend on a grid having a value in
    #       every cell (ok rule for bonusWord and yourLetters, but not main crossword grid).
    isComplete: () ->
      @cells.every((cellModel) ->
        return cellModel.hasValue() && @contentMap[cellModel.content.toLowerCase()].length == 1
      )

    isInputValid: (cursorCell, inputValue) ->
      retVal = true
      if (AbstractGridModel.notBlankRegex.test(inputValue))
        inputValue = inputValue.toLowerCase()
        if (!cursorCell.isContentEqualTo(inputValue) && @isLetterUsed(inputValue))
          # TODO: Signal transient error message
          inputValue = false
      else
        # TODO: Signal transient error message
        inputValue = false

      return retVal

    ##
    ## Mutator
    setContentValue: (targetCell, newValue) ->
      # TODO
      # @parentGrid.markDirty(@)

      if (targetCell.content != newValue)
        @contentMap[targetCell.content] = @contentMap[targetCell.content].filter((cellModel) -> return cellModel == targetCell)
        targetCell.content = newValue
        @contentMap[newValue].push(targetCell)

      return true

    ##
    ## Cursor based key stroke handlers
    handleAlpha: (targetCell, inputValue) ->
      nextCell = @
      editAnalysis = isInputValid(@, inputValue)
      if editAnalysis == false
        retVal = [OnHandleEventAction.NO_ACTION]
      else
        @setContentValue(targetCell, inputValue)
        nextCell = targetCell.getNextCell()
        if (nextCell != @)
          retVal = [OnHandleEventAction.MOVE_CURSOR, nextCell]
        else
          retVal = [OnHandleEventAction.NO_ACTION]
      return retVal

    handleBackspace: (targetCell) ->
      @setContentValue(targetCell, '_')
      return [OnHandleEventAction.NO_ACTION]

    handleLeftArrow: (targetCell) ->
      return [OnHandleEventAction.MOVE_CURSOR, targetCell.getPreviousCell()]
    handleRightArrow: (targetCell) ->
      return [OnHandleEventAction.MOVE_CURSOR, targetCell.getNextCell()]
    handleUpArrow: (targetCell) ->
      return [OnHandleEventAction.NO_ACTION]
    handleDownArrow: (targetCell) ->
      return [OnHandleEventAction.NO_ACTION]

    handleEscape: (targetCell) ->
      return [OnHandleEventAction.CLOSE, false]
    handleEnter: (targetCell) ->
      return [OnHandleEventAction.CLOSE, true]
    handleTab: (targetCell) ->
      return [OnHandleEventAction.NO_ACTION]



  class AbstractCellModel
    dirty: false

    constructor: (@indexId, @rowId, @colId, @content) ->
      @coordinates = rowId + ',' + colId
      @setInactiveFillState()
      @displayContent = @content
      return @

    ##
    ## Model bootstrapping
    setParentGrid: (parentGrid) ->
      @parentGrid = parentGrid
      return

    ##
    ## Cell clickability
    handleCellClick: () ->
      # TODO: Primitive (wrong) implementation: accept all clicks and doesn't optimize moves.
      return [OnHandleEventAction.OPEN_CURSOR, true, @]

    ##
    ## Cursor handling
    handleOpenCursor: () ->
      @fillState = CellStateKind.SELECTED.getImageKey()
      @displayContent = 'cursor'
      return

    handleCloseCursor: (withCommit) ->
      @setInactiveFillState()
      @displayContent = @content
      return

    handleReceiveCursorFrom: (fromCell) ->
      @fillState = CellStateKind.SELECTED.getImageKey()
      @displayContent = 'cursor'
      return

    handleReleaseCursorTo: (toCell) ->
      @setInactiveFillState()
      @displayContent = @content
      return

    ##
    ## Queries
    isBlank: () -> return @content == '_'
    hasContent: () -> return @content != '_'
    isBlocked: () -> return false
    hasError: () -> return false
    hasMatchedContent: () -> return false

    # Internal use method for setting a cell's content AND triggering any side effects such as maintenance
    # to the @contentMap.  Subtypes may override this method, but must call the base implementation to
    # ensure inheritted book-keeping behaves as expected.  Override implementations should not set
    # @content themselves (treat it as private) and should ensure any non-blank input is passed as lower-case.

    ##
    ## Queries for UI

    # Each subtype will want to override this method--they each have different business logic surrounding fill states
    setInactiveFillState: () ->
      if @isBlank()
        @fillState = CellStateKind.COVERED.getImageKey()
      else if @isBlocked()
        @fillState = CellStateKind.BLOCKED.getImageKey()
      else if @hasError()
        @fillState = CellStateKind.ERROR.getImageKey()
      else if @hasMatchedContent()
        @fillState = CellStateKind.MATCHED.getImageKey()
      else
        @fillState = CellStateKind.COVERED.getImageKey()

      return

    # Each subtype will want to override this method--they each have different business logic surrounding borders
    getBorder: () -> return 'blank'

    # Each subtype SHOULD override these to define forward/backward navigation and boundaries
    getNextCell: () -> return @
    getPreviousCell: () -> return @


  #
  # Bonus Word Grid and Cell
  #
  class BonusWordGrid extends AbstractGridModel
    constructor: (cells) ->
      super 'bonusWord', 1, 5, cells
      return @

  class BonusWordCell extends AbstractCellModel
    next: null
    previous: null

    constructor: (yAbs, content) ->
      super yAbs, 0, yAbs, content
      return @

    getNextCell: () -> return @next
    getPreviousCell: () -> return @previous

    getBorder: () ->
      retVal = 'blank'
      if (@parentGrid.parentTicket.cursorCell == this)
        switch(@colId)
          when 0
            retVal = OrientationKind.HORIZONTAL.getBorderHead()
          when 4
            retVal = OrientationKind.HORIZONTAL.getBorderTail()
          else
            retVal = OrientationKind.HORIZONTAL.getBorderMiddle()

      return retVal


  #
  # Your Letters Grid and Cell
  #
  class YourLettersGrid extends AbstractGridModel
    constructor: (cells) ->
      super 'yourLetters', 3, 6, cells
      return @

  class YourLettersCell extends AbstractCellModel
    next: null
    previous: null

    handleUpArrow: () ->
      console.log("TODO: Add vertical navigation to YourLetters")
      return [OnHandleEventAction.NO_ACTION]
    handleDownArrow: () ->
      console.log("TODO: Add vertical navigation to YourLetters")
      return [OnHandleEventAction.NO_ACTION]

    getNextCell: () -> return @next
    getPreviousCell: () -> return @previous

    # TODO: Need an image for unary borders
    getBorder: () ->
      return 'blank'


  #
  # Main Crossword Grid and Cell
  #
  class CrosswordGrid extends AbstractGridModel
    rowWordHeads: []
    colWordHeads: []
    tripleWords:  []

    constructor: (cells) ->
      @orientation = OrientationKind.HORIZONTAL
      super 'crossword', 11, 11, cells

      return @

    toggleOrientation: () ->
      @orientation = @orientation.getOpposite()

    ##
    ## Cursor based key stroke handlers
    handleAlpha: (targetCell, inputValue) ->
      nextCell = @
      editAnalysis = @isInputValid(targetCell, inputValue)
      if editAnalysis == false
        retVal = [OnHandleEventAction.NO_ACTION]
      else
        @setContentValue(targetCell, inputValue)
        nextCell = targetCell.getNextCell()
        if (nextCell != @)
          retVal = [OnHandleEventAction.MOVE_CURSOR, nextCell]
        else
          retVal = [OnHandleEventAction.NO_ACTION]

      return retVal

    handleBackspace: (targetCell) ->
      this.setContentValue(targetCell, '_')
      return [OnHandleEventAction.NO_ACTION]

    handleLeftArrow: (targetCell) ->
      return [OnHandleEventAction.MOVE_CURSOR, targetCell.getPreviousCell()]
    handleRightArrow: (targetCell) ->
      return [OnHandleEventAction.MOVE_CURSOR, targetCell.getNextCell()]
    handleUpArrow: (targetCell) ->
      return [OnHandleEventAction.NO_ACTION]
    handleDownArrow: (targetCell) ->
      return [OnHandleEventAction.NO_ACTION]

    handleEscape: (targetCell) ->
      return [OnHandleEventAction.CLOSE, false]
    handleEnter: (targetCell) ->
      return [OnHandleEventAction.CLOSE, true]
    handleTab: (targetCell) ->
      return [OnHandleEventAction.NO_ACTION]

    isInputValid: (targetCell, inputValue) ->
      if inputValue == '_'
        # Clearing values is always legal, but not through this code path.
        return false

      if targetCell.hasContent()
        # Changing an existing value has no impact on word allocation, but it could still add or
        # remove tripling modifiers.
        joinAnalysis = [
          {
            result: 'valueChange'
            numWordsDelta: 0
          },
          {
            result: 'valueChange',
            numWordsDelta: 0
          }
        ]
      else
        joinAnalysis = OrientationKind.getAll().map( (nextDir) ->
          adjCells = [ targetCell[nextDir.toNeighbors[0]], targetCell[nextDir.toNeighbors[1]] ]
          if adjCells[0]?.hasContent()
            if adjCells[1]?.hasContent()
              adjWords = [adjCells[0][nextDir.toDirectWord], adjCells[1][nextDir.toDirectWord]]
              if adjWords[0]?
                if adjWords[1]?
                  return {
                    result: 'mergeTwoWords',
                    existingWords: adjWords,
                    toWords: nextDir.toNeighbors
                    wordCells: adjCells
                    numWordsDelta: -1
                  }
                else
                  return {
                    result: 'extendByTwo'
                    existingWord: adjWords[0]
                    toWord: nextDir.toNeighbors[0]
                    wordCell: adjCells[0]
                    toLetterTwo: nextDir.toNeighbors[1]
                    letterCell: adjCells[1]
                    numWordsDelta: 0
                  }
              else if adjWords[1]?
                return {
                  result: 'extendByTwo'
                  existingWord: adjWords[1]
                  toWord: nextDir.toNeighbors[1]
                  wordCell: adjCells[1]
                  toLetterTwo: nextDir.toNeighbors[0]
                  letterCell: adjCells[0]
                  numWordsDelta: 0
                }
              else
                return {
                  result: 'joinTwoLetters'
                  toLetters: nextDir.toNeighbors
                  letterCells: adjCells
                  numWordsDelta: 1
                }
            else
              hasWord = adjCells[0][nextDir.toDirectWord]
              if hasWord
                return {
                  result: 'extendByOne'
                  existingWord: hasWord
                  toWord: nextDir.toNeighbors[0]
                  wordCell: adjCells[0]
                  numWordsDelta: 0
                }
              else
                return {
                  result: 'joinOneLetter'
                  toLetter: nextDir.toNeighbors[0]
                  letterCell: adjCells[0]
                  numWordsDelta: 1
                }
          else if adjCells[1]?.hasContent()
            hasWord = adjCells[1][nextDir.toDirectWord]
            if hasWord
              return {
                result: 'extendByOne'
                existingWord: hasWord
                toWord: nextDir.toNeighbors[1]
                wordCell: adjCells[1]
                numWordsDelta: 0
              }
            else
              return {
                result: 'joinOneLetter'
                toLetter: nextDir.toNeighbors[0]
                letterCell: adjCells[0]
                numWordsDelta: 1
              }
          else if adjCells[0]?
            if adjCells[1]?
              return {
                result: 'isolated'
                type: 'mid'
                toBlanks: nextDir.toNeighbors
                blankCells: adjCells
                numWordsDelta: 0
              }
            else
              return {
                result: 'isolated'
                type: 'edge'
                toBlank: nextDir.toNeighbors[0]
                blankCell: adjCells[0]
                numWordsDelta: 0
              }
          else
            return {
              result: 'isolated'
              type: 'edge'
              toBlank: nextDir.toNeighbors[1]
              blankCell: adjCells[1]
              numWordsDelta: 0
            }
        )

      # Tripling modifier rules
      if @parentTicket.isTripleBonusUsed()
        if /^[A-Z]$/.test(inputValue) && !targetCell.hasTriple()
          if @tripleWords.length >= 4
            # Reject input: too many triples in play already
            return false
          if joinAnalysis[0].result != 'isolated' && joinAnalysis[1].result != 'isolated'
            # Reject input: no triples at a cell union
            return false
          if joinAnalysis.some( (aJoin) ->
            switch aJoin.result
              when 'extendByOne'
                retVal = aJoin.existingWord.hasTriple()
              when 'extendByTwo'
                retVal = aJoin.existingWord.hasTriple() || aJoin.letterCell.hasTriple()
              when 'joinOneLetter'
                retVal = aJoin.letterCell.hasTriple()
              when 'joinTwoLetters'
                retVal = aJoin.letterCells[0].hasTriple() || aJoin.letterCells[1].hasTriple()
              when 'mergeTwoWords'
                retVal = aJoin.existingWords[0].hasTriple() || aJoin.existingWords[1].hasTriple()
              else
                retVal = false
            return retVal
          )
            # Reject input: Connects with pre-existing triples
            return false

      # Word count rules
      totalWordDelta = joinAnalysis[0].numWordsDelta + joinAnalysis[1].numWordsDelta
      currentWordCount = @rowWordHeads.length + @colWordHeads.length
      if totalWordDelta > 0 && currentWordCount >= 22
        # Reject input: Cannot create words when maxed out already
        return false
      else if totalWordDelta > 1 && currentWordCount == 21
        # Reject input: Cannot create words when maxed out already
        return false
      else if @rowWordHeads.length >= 12 && joinAnalysis[0].numWordsDelta > 0
        # At most 12 words in each orientation
        return false
      else if @colWordHeads.length >= 12 && joinAnalysis[1].numWordsDelta > 0
        # At most 12 words in each orientation
        return false

      # TODO: Nascent word viability rules:
      # 1) Don't allow two letters to join if they cannot acquire a third.
      # 2) Don't allow an otherwise legal placement that would block a letter pair from
      #    acquiring a third letter
      # #1 requires a rather difficult test, #2 may be addressable by proactive cell blocking
      # in part, but it may be necessary to consider gaps of length 2

      # TODO: Illegal joins by length:
      # A word merge cannot create a word with 10 or 11 letters.  This should be dealt with
      # by proactively blocking the only cell between two words of sufficient length.

      # Success!  The value change is legal and we have a description of how the board will
      # change that we can return.
      return joinAnalysis

    # TODO: Provide a REAL implementation!
    isComplete: () -> return true

  # TODO: Enforce constraint that boardModel must be a CrosswordGrid
  class FixedCell extends AbstractCellModel
    isTriple: null
    alignedWordRegion: null
    rotatedWordRegion: null

    constructor: (gridModel, rowId, colId, content) ->
      super gridModel, rowId, colId, content
      @isTriple = false
      @aligned = new RelativeCell(rowId, colId)
      @rotated = new RelativeCell(colId, rowId)
      return @

    # Get the orientation-dependent object with links in all four directions plus diagonals.  If
    # a specific orientation is requested by argument, then the corresponding RelativeCell is
    # returned, otherwise the current orientation setting of the parent grid is used instead.
    getRel: (orientation = @parentGrid.orientation) ->
      if (orientation == OrientationKind.VERTICAL)
        return @rotated
      else
        return @aligned

    getToAbove: (orientation) -> return @getRel(orientation).toAbove
    getToBelow: (orientation) -> return @getRel(orientation).toBelow
    getToLeft:  (orientation) -> return @getRel(orientation).toLeft
    getToRight: (orientation) -> return @getRel(orientation).toRight

    # Access the oreintation-dependent (x,y) coordinates.  @ALIGNED coordinates are identical to
    # fixed, but @ROTATED are swapped and return as (y,x).
    getRelRowId: (orientation) -> return @getRel(orientation).rowId
    getRelColId: (orientation) -> return @getRel(orientation).colId

    ##
    ## Model bootstrapping
    ##

    setParentGrid: (parentGrid) ->
      super(parentGrid)
      @aligned.initDiagonals(OrientationKind.HORIZONTAL)
      @rotated.initDiagonals(OrientationKind.VERTICAL)
      return

    ##
    ## Event handling
    ##

    handleKeyPress: (value) ->
      legalValue = @getLegalValue value
      if (legalValue?)
        @content = legalValue.toLowerCase()
        if (legalValue != @content)
          @isTriple = true
        else
          @isTriple = false

      nextCell = @getNextCell()
      if (nextCell?)
        retVal = [OnHandleEventAction.MOVE_CURSOR, nextCell]
      else
        retVal = [OnHandleEventAction.NO_ACTION]

      return retVal

    getNextCell: () -> return @getToRight()
    getPreviousCell: () -> return @getToLeft()

    getBorder: () ->
      retVal = 'blank'
      if (false)
        retVal = @orientation.getHeadBorder()
      else if (false)
        retVal = @orientation.getTailBorder()
      else if (
        false &&
        (forCellModel.parentGrid == @wordLeft?.parentGrid) &&
        (forCellModel.parentGrid == @wordRight?.parentGrid) &&
        (forCellModel.getRelRowId() == @wordLeft.getRelRowId()) &&
        (forCellModel.getRelRowId() == @wordRight.getRelRowId()) &&
        (forCellModel.getRelColId() > @wordLeft.getRelColId()) &&
        (forCellModel.getRelColId() < @wordRight.getRelColId())
      )
        # The complex-looking test above passes if forCellModel, wordLeft, and wordRight
        # all belong to the same orientation-aware row of the same grid and forCellModel's
        # orientation-aware column is both to wordLeft's right and to wordRight's left.
        retVal = @orientation.getMidBorder()

      return retVal.imageKey

    cellState: (forCellModel) ->
      if ((forCellModel == @cursorLeft) || (forCellModel == @cursorRight))
        return CellStateKind.SELECTED
      else if (
        (@cursorLeft?) && (@cursorRight?) &&
        (forCellModel.getRelRowId() == @cursorLeft.getRelRowId()) &&
        (forCellModel.getRelColId() > @cursorLeft.getRelColId()) &&
        (forCellModel.getRelRowId() == @cursorRight.getRelRowId()) &&
        (forCellModel.getRelColId() < @cursorRight.getRelColId())
      )
        return CellStateKind.SELECTED

      return forCellModel.state

    openCursor: () ->
      @parentGrid.wordLeft = @searchLeft(this, true)
      @parentGrid.wordRight = @searchRight(this, true)
      @parentGrid.cursorLeft = @searchLeft(@parentGrid.wordLeft, false)
      @parentGrid.cursorRight = @searchRight(@parentGrid.wordRight, false)

      return

  # Enumeration of single and multi-bit masks for rapid corner/edge/interior detection
  class CellRegionEnum
    @INTERIOR = 0

    @TOP_EDGE = 1
    @BOTTOM_EDGE = 2
    @LEFT_EDGE = 4
    @RIGHT_EDGE = 8

    @TOP_LEFT_CORNER = @TOP_EDGE | @LEFT_EDGE          # 5
    @TOP_RIGHT_CORNER = @TOP_EDGE | @RIGHT_EDGE        # 9
    @BOTTOM_LEFT_CORNER = @BOTTOM_EDGE | @LEFT_EDGE    # 6
    @BOTTOM_RIGHT_CORNER = @BOTTOM_EDGE | @RIGHT_EDGE  # 10

    @HORIZONTAL_EDGE = @TOP_EDGE | @BOTTOM_EDGE        # 3
    @VERTICAL_EDGE = @LEFT_EDGE | @RIGHT_EDGE          # 12
    @ANY_EDGE = @HORIZONTAL_EDGE | @VERTICAL_EDGE      # 15

    # 7, 11, 13, 14 are not terribly useful trios of edges)

  class RelativeCell
    toAbove: null
    toBelow: null
    toLeft: null
    toRight: null

    toAboveLeft: null
    toAboveRight: null
    toBelowLeft: null
    toBelowRight: null

    constructor: (@rowId, @colId) ->
      if (rowId == 0)
        if (colId == 0)
          # Top Left Corner
          @cellRegion = CellRegionEnum.TOP_LEFT_CORNER
        else if (colId == 10)
          # Top Right Corner
          @cellRegion = CellRegionEnum.TOP_RIGHT_CORNER
        else
          # Top Edge
          @cellRegion = CellRegionEnum.TOP_EDGE
      else if (rowId == 10)
        if (colId == 0)
          # Bottom Left Corner
          @cellRegion = CellRegionEnum.BOTTOM_LEFT_CORNER
        else if (colId == 10)
          # Bottom Right Corner
          @cellRegion = CellRegionEnum.BOTTOM_RIGHT_CORNER
        else
          # Bottom Edge
          @cellRegion = CellRegionEnum.BOTTOM_EDGE
      else if (colId == 0)
        # Left Edge
        @cellRegion = CellRegionEnum.LEFT_EDGE
      else if (colId == 10)
        # Right Edge
        @cellRegion = CellRegionEnum.RIGHT_EDGE
      else
        # Interior
        @cellRegion = CellRegionEnum.INTERIOR
      return @

    # This routine is called twice for each fixed cell during model construction.  The orientation is toggled
    # between the calls such that each RelativeCell handles its call at a time when the overall grid is in its
    # assigned orientation.  This provides navigability in a total of eight different directions, simplifying
    # tests for fill viability, which involves checking the other three cells of either 1 (4 corners), 2 (36
    # non-corner edges) or 4 (81 interior cells) 2x2 quads.  To simplify, triplets for the appropriate quads
    # are derived and cached at this time as well.
    initDiagonals: (orientation) ->
      if (@cellRegion == CellRegionEnum.INTERIOR)
        @toAboveLeft = @toAbove.getToLeft(orientation)
        @toAboveRight = @toAbove.getToRight(orientation)
        @toBelowLeft = @toBelow.getToLeft(orientation)
        @toBelowRight = @toBelow.getToRight(orientation)
        @quads = [
          new Array(@toLeft,  @toAboveLeft,  @toAbove)
          new Array(@toRight, @toAboveRight, @toAbove)
          new Array(@toLeft,  @toBelowLeft,  @toBelow)
          new Array(@toRight, @toBelowRight, @toBelow)
        ]
      else if (@cellRegion & CellRegionEnum.HORIZONTAL_EDGE)
        if (@cellRegion & CellRegionEnum.VERTICAL_EDGE)
          # Its a corner
          if (@cellRegion & CellRegionEnum.TOP_EDGE)
            if (@cellRegion == CellRegionEnum.TOP_LEFT_CORNER)
              @toBelowRight = @toBelow.getToRight(orientation)
              @quads = [new Array(@toRight, @toBelowRight, @toBelow)]
            else
              @toBelowLeft = @toBelow.getToLeft(orientation)
              @quads = [new Array(@toLeft,  @toBelowLeft,  @toBelow)]
          else if (@cellRegion == CellRegionEnum.BOTTOM_LEFT_CORNER)
            @toAboveRight = @toAbove.getToRight(orientation)
            @quads = [new Array(@toRight, @toAboveRight, @toAbove)]
          else
            @toAboveLeft = @toAbove.getToLeft(orientation)
            @quads = [new Array(@toLeft,  @toAboveLeft,  @toAbove)]
        else if (@cellRegion == CellRegionEnum.TOP_EDGE)
          @toBelowLeft = @toBelow.getToLeft(orientation)
          @toBelowRight = @toBelow.getToRight(orientation)
          @quads = [
            new Array(@toLeft,  @toBelowLeft,  @toBelow)
            new Array(@toRight, @toBelowRight, @toBelow)
          ]
        else
          @toAboveLeft = @toAbove.getToLeft(orientation)
          @toAboveRight = @toAbove.getToRight(orientation)
          @quads = [
            new Array(@toLeft,  @toAboveLeft,  @toAbove)
            new Array(@toRight, @toAboveRight, @toAbove)
          ]
      else if (@cellRegion == CellRegionEnum.LEFT_EDGE)
        @toAboveRight = @toAbove.getToRight(orientation)
        @toBelowRight = @toBelow.getToRight(orientation)
        @quads = [
          new Array(@toRight, @toAboveRight, @toAbove)
          new Array(@toRight, @toBelowRight, @toBelow)
        ]
      else
        @toAboveLeft = @toAbove.getToLeft(orientation)
        @toBelowLeft = @toBelow.getToLeft(orientation)
        @quads = [
          new Array(@toLeft,  @toAboveLeft,  @toAbove)
          new Array(@toLeft,  @toBelowLeft,  @toBelow)
        ]
      return

  class WordRegion
    constructor: (@head, @tail, @orientation) -> return

  return xwModule