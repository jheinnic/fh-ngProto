(function() {
  'use strict';

  module.exports = portfolioAppLauncher;

  // require('fh-mgr').run(portfolioAppLauncher);
  // angular.module('fh-mgr').run(portfolioAppLauncher);

  portfolioAppLauncher.$inject=['IdentityContext', '$state'];
  altPortfolioAppLauncher.$inject=['$rootScope', '$urlRouter', 'IdentityContext'];

  function portfolioAppLauncher (IdentityContext, $state) {
    var latestEvent = IdentityContext.getAuthTokenStatus();

    var eventType = latestEvent.getEventType();
    if (eventType.isLoggedIn()) {
      $state.go('home', {reload: false});
    } else {
      // $state.go('loginForm.showForm', {reload: false});
      $state.go('loginForm', {reload: false});
    }
  }

  function altPortfolioAppLauncher($rootScope, $urlRouter, IdentityContext) {
    $rootScope.$on('$locationChangeSuccess', function(e) {
      // UserService is an example service for managing user state
      if (IdentityContext.isLoggedIn()) return;

      // Prevent $urlRouter's default handler from firing
      e.preventDefault();

      // TODO: This would be nifty, but can handleLogin() exist as a synchronous
      //       method call?  Possibly in an in-page modal?
      IdentityContext.handleLogin().then(function() {
        // Once the user has logged in, sync the current URL
        // to the router:
        $urlRouter.sync();
      });
    });

    // Configures $urlRouter's listener *after* your custom listener
    $urlRouter.listen();
  }
}).call(window);
