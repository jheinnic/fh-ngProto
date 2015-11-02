(function() {
  'use strict';

  module.exports = authenticateConfig;
  authenticateConfig.$inject=['$stateProvider'];

    /**
     * @ngdoc method
     * @name fh-mgr.authenticate
     *
     * @description
     * Routing component of the portfolio application's authentication module.
     */
    function authenticateConfig ($stateProvider) {
        $stateProvider.state(
            'login',
            {
                url: '/login/showForm',
                templateUrl: 'views/fh-mgr/authenticate/loginForm.view.html',
                controller: 'LoginController',
                controllerAs: 'login',
                resolve: {
                    appContextStatus: checkAppContext
                },
                abstract: false,
                authenticate: false
            }
        );
    }

    checkAppContext.$inject = ['IdentityContext'];

    function checkAppContext(IdentityContext) {
        return IdentityContext.verifyAuthTokenStatus();
    }
    /*
            $stateProvider
                .state('login', {
                    templateUrl: '/views/fh-mgr/authenticate/loginForm.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'login',
                    abstract: true,
                    authenticate: false
                }).state('login.showForm', {
                    url: '/login/showForm',
                    resolve: {
                        appContextStatus: null,
                        loginKind: getRoutedToLoginKind()
                    },
                    abstract: false,
                    authenticate: false
                }).state('login.onReturn', {
                    url: '/login/onFail',
                    resolve: {
                        appContextStatus: checkAppContext()
                        loginKind: getWithAuthTokenLoginKind()
                    },
                    abstract: false,
                    authenticate: false
                }.state('login.attemptFailed', {
                    url: '/login/attemptFailed',
                    resolve: {
                        appContextStatus: null,
                        loginKind: getBadCredentialsLoginKind()
                    },
                    abstract: false,
                    authenticate: false
               }
            );
        }

        getLoginRequestedLoginKind.$inject = ['LOGIN_KIND_ENUM'];
        getWithAuthTokenLoginKind.$inject = ['LOGIN_KIND_ENUM'];
        getBadCredentialsLoginKind.$inject = ['LOGIN_KIND_ENUM'];

        function getLoginRequestedLoginKind(LOGIN_KIND_ENUM) {
            return LOGIN_KIND_ENUM.LOGIN_REQUESTED;
        }

        function getBadCredentialsLoginKind(LOGIN_KIND_ENUM) {
            return LOGIN_KIND_ENUM.BAD_CREDENTIALS;
        }

        function getWithAuthTokenLoginKind(LOGIN_KIND_ENUM) {
            return LOGIN_KIND_ENUM.WITH_AUTH_TOKEN;
        }

        function getInternalErrorLoginKind(LOGIN_KIND_ENUM) {
            return LOGIN_KIND_ENUM.INTERNAL_ERROR;
        }

        function getInvalidTokenLoginKind(LOGIN_KIND_ENUM) {
            return LOGIN_KIND_ENUM.TOKEN_NOT_VALID;
        }

        function getExpiredTokenLoginKind(LOGIN_KIND_ENUM) {
            return LOGIN_KIND_ENUM.TOKEN_EXPIRED;
    */
}).call(window);
