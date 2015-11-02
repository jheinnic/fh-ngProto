(function () {
  'use strict';

  module.exports = ptfLoginModal;
  ptfLoginModal.$inject = ['$log', 'IdentityContext', 'ContextModelPackage'];

  /**
   * @ngdoc directive
   * @name fh-mgr.authenticate.directive#ptfLoginModal
   * @description Directive for placing a modal on any page supporting a
   * workflow that can involve a significant time investment.  The form
   * it embeds supports two modes of operation.
   *
   * 1)  If a user's session token is in danger of timing out, the modal
   *     asks the user to click an Ok button and allow it to refresh the
   *     session.
   * 2)  If the session has already expired, the modal instead prompts
   *     the user to enter credentials, allowing for an authentication
   *     attempt to take place without breaking away from the current
   *     page's invested state.
   *
   * The modal's initial state is always 'AUTHENTICATED', so please only
   * apply this directive on pages whose ui.router state descriptor
   * has 'authenticated=true'.
   *
   * Also note that it is not necessary to use this directive on every
   * authenticated page.  Its only needed if there is a significant cost
   * to redirecting a user to the login page in terms of the time invested
   * in an interrupted workflow.
   */

  function ptfLoginModal($log, IdentityContext, ContextModelPackage) { // , ModalService) {
    // Retrieve IdentityContext service's event type enumeration.
    var AuthTokenEventKind  = ContextModelPackage.AuthTokenEventKind;

    return {
      restrict: 'E',
      scope: {
        // These handlers are intended to be optional.  Most likely overkill.
        // An isolated scope is appropriate here at any rate.
        // 'onModalActive': '?&',
        // 'onModalInactive': '?&'
      },
      templateUrl: 'views/fh-mgr/authenticate/loginModal.html',
      link: function linkPtfLoginModal($scope/*, $elem, $attr*/) {
        // The identity service uses a promise to fire this as a
        // then handler when a suitable state change occurs.
        //
        // The service should fire call this handler once
        // immediately on registration to inform on present state.
        $scope.context = {
          tokenState: AuthTokenEventKind.NO_TOKEN_AVAILABLE
        };

        function onTokenEvent(tokenEvent) {
          if (tokenEvent && tokenEvent.eventType) {
            $scope.context.tokenState = tokenEvent.eventType;
          } else {
            $log.warn('Unrecognized event type from identity context service:', tokenEvent);
          }

          // TODO: tokenEvent.preventDefault( ) ?
          // tokenEvent.preventDefault();
        }

        IdentityContext.addTokenEventListener(onTokenEvent);

        $scope.$on('$destroy', function onDestroy() {
          // Identity provider generates a new promise and
          // re-registers surviving observers, if any.
          IdentityContext.dropTokenEventListener(onTokenEvent);
        });
      }
    };
  }
}).call(window);
