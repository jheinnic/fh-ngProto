(function() {
  'use strict';

  module.exports = LoginController;

  LoginController.$inject =
    ['$scope', '$state', 'toastr', 'IdentityContext', 'ContextModelPackage', 'IdentityContext'];

  // var path = require('path');

  /**
   *
   * @param $scope {$scope}
   * @param $state {$state}
   * @param toastr {toastr}
   * @param IdentityContext {IdentityContext}
   * @param ContextModelPackage {ContextModelPackage}
   * @constructor
   */
  function LoginController($scope, $state, toastr, IdentityContext, ContextModelPackage) {
    /**
     * @class {AuthTokenEventKind}
     */
    var AuthTokenEventKind = ContextModelPackage.AuthTokenEventKind;

    // First check for a reply from the identity context service.  If that
    // confirms that the user is not logged in, check to see if they came
    // back with a potentially valid token that must be checked before
    // proceeding, routing the user back into the login workflow if not.
    //
    // Finally, all other states are specific known cases where this page
    // form is the right place to be.  Those states only differ by the
    // kind of feedback the user is given.

    this.latestAuthTokenEvent = IdentityContext.getLatestTokenEvent();

    var watchEventTypeHandle = $scope.$watch(
      'login.latestAuthTokenEvent.eventType',
      function onEventTypeChange(tokenEventType) {
        if (tokenEventType.isLoggedIn()) {
          $state.go('home', {reload: false});
        } else {
          // if (tokenEventType !== AuthTokenEventKind.NO_TOKEN_AVAILABLE) {
          //  $state.go('^.attemptFailed', {reload: false});
          switch (tokenEventType) {
            case AuthTokenEventKind.TOKEN_IS_INVALID:
              toastr.error(
                'The application could not decode the access token it received.  Please try logging in again.',
                'Invalid Access Token'
              );
              break;
            case AuthTokenEventKind.INTERNAL_ERROR:
              toastr.error(
                'A system error is preventing the application from handling your login.  ' +
                'Please try again later, or contact support if this has been an ongoing problem.',
                'System Error'
              );
              break;
            case AuthTokenEventKind.TOKEN_HAS_EXPIRED:
              toastr.error(
                'Your existing access token has either run past its expiration or timed out during an extended' +
                'period of inactivity.  Please log back in to continue.',
                'Expired Access Token'
              );
              break;
            case AuthTokenEventKind.TOKEN_WAS_REVOKED:
              toastr.error(
                'Access to your account has been suspended and outstanding access tokens revoked.' +
                'Before attempting to log back in, please contact customer support for assistance.',
                'Account Suspended'
              );
              break;
            case AuthTokenEventKind.TOKEN_MAY_EXPIRE:
              toastr.warn(
                'Your access token is about to expire!  If you are still using the application, please click' +
                'the "Refresh Session" button below or create session activity to reset the time remaining.' +
                'If your session expires before then, logging in using the displayed form will allow you to' +
                'resume your current task.',
                'Access Token May Expire!'
              );
              break;
            case AuthTokenEventKind.NO_TOKEN_AVAILABLE:
              // No-op.
              break;
          }
        }
      }
    );

    this.onNextStatusUpdate = function onNextStatusUpdate(authTokenEvent) {
      this.latestAuthTokenEvent = authTokenEvent;

      if (this.onNextStatusUpdate) {
        authTokenEvent.nextPromise.then(this.onNextStatusUpdate);
      }
      return authTokenEvent;
    };
    this.latestAuthTokenEvent.nextPromise.then(this.onNextStatusUpdate);

    this.onDestroyHandler = function onDestroyHandler() {
      this.onNextStatusUpdate = null;
      watchEventTypeHandle();
    };

    $scope.$on('$destroy', this.onDestroyHandler);
  }
}).call(window);

