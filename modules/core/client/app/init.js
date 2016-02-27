'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider', '$translateProvider',
  function ($locationProvider, $httpProvider, $translateProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    $translateProvider.translations('de-DE', {
      'LABEL-EMAIL':'Hey Guys, this is a headline!',
      'SOME_TEXT': 'A text anywhere in the app.'
    });

    $translateProvider.translations('en-EN', {
      // VIEW ----- signin.client.view.html ------
      // LABELS
      'LABEL-EMAIL':'eMail',
      'LABEL-PASSWORD':'Password',
      'PLACEHOLDER-LABEL-EMAIL':'email ...',
      'PLACEHOLDER-LABEL-PASSWORD':'password...',

      // BUTTONS
      'BUTTON-TEXT-SIGNIN': 'Sign in',
      'BUTTON-TEXT-SIGNUP': 'Sign up',
      'BUTTON-TEXT-FORGOTPWD': 'Forgot password',

      // VALDIATIONS
      'VALIDATION-REQ-EMAIL':'eMail is required.',
      'VALIDATION-REQ-PASSWORD':'Password is required.'

      // ERRORS

    });

    /*
    $translateProvider.useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    */

    $translateProvider.preferredLanguage('en-EN');

  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, $window, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  $rootScope.$on('$viewContentLoaded', function(){

    var interval = setInterval(function(){
      if (document.readyState == "complete") {
        window.scrollTo(0, 0);
        clearInterval(interval);
      }
    },200);

  });


  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
