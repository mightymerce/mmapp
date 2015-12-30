'use strict';

angular.module('users').controller('AuthenticationController', ['$route', '$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Currencys', 'Deliverys','Taxes',
  function ($route, $scope, $state, $http, $location, $window, Authentication, PasswordValidator, Currencys, Deliverys, Taxes) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // Create empty legal object
        $http.post('/api/legals', $scope.credentials).success(function (response) {
        }).error(function (response) {
          $scope.error = response.message;
        });

        // Create currency object - EUR
        // Create new Currency object
        var currency = new Currencys({
          currencyCode: 'EUR',
          currencyValue: 'Euro'
        });

        // save
        currency.$save(function (response) {
        }, function (errorResponse) {
        });

        // Create delivery object - standard delivery
        // Create new Delivery object
        var delivery = new Deliverys({
          deliveryTitle: 'Standard',
          deliveryTime: '3-5 working days',
          deliveryCountry: 'Germany',
          deliveryCost: '3,50'
        });

        // save
        delivery.$save(function (response) {
        }, function (errorResponse) {
        });

        // Create taxes object - 7 and 19 %
        // Create new Taxe object
        var taxe19 = new Taxes({
          taxCountry: 'Germany',
          taxRate: '19'
        });

        // Redirect after save
        taxe19.$save(function (response) {
        }, function (errorResponse) {
        });

        // Create new Taxe object
        var taxe7 = new Taxes({
          taxCountry: 'Germany',
          taxRate: '7'
        });

        // Redirect after save
        taxe7.$save(function (response) {
        }, function (errorResponse) {
        });


        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'dashboard', $state.previous.params);

      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go('dashboard', $state.previous.params);

      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
