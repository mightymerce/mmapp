'use strict';

// Currencys controller
angular.module('currencys').controller('CurrencysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Currencys',
  function ($scope, $stateParams, $location, Authentication, Currencys) {
    $scope.authentication = Authentication;

    // Create new Currency
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'currencyForm');

        return false;
      }

      // Create new Currency object
      var currency = new Currencys({
        currencyCode: this.currencyCode,
        currencyValue: this.currencyValue
      });

      // Redirect after save
      currency.$save(function (response) {
        $location.path('currencys/' + response._id);

        // Clear form fields
        $scope.currencyCode = '';
        $scope.currencyValue = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Currency
    $scope.remove = function (currency) {
      if (currency) {
        currency.$remove();

        for (var i in $scope.currencys) {
          if ($scope.currencys[i] === currency) {
            $scope.currencys.splice(i, 1);
          }
        }
      } else {
        $scope.currency.$remove(function () {
          $location.path('currencys');
        });
      }
    };

    // Update existing Currency
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'currencyForm');

        return false;
      }

      var currency = $scope.currency;

      currency.$update(function () {
        $location.path('currencys/' + currency._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Currencys
    $scope.find = function () {
      $scope.currencys = Currencys.query({
        'user._id': $scope.authentication.user._id
      });
    };

    // Find existing Currency
    $scope.findOne = function () {
      $scope.currency = Currencys.get({
        currencyId: $stateParams.currencyId
      });
    };
  }
]);
