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
        currencyValue: this.currencyValue,
        currencyStandard: this.currencyStandard
      });

      // Redirect after save
      currency.$save(function (response) {
        $scope.success = 'You successfully created a currency option.';
        $location.path('currencys/' + response._id + '/edit');

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

      currency.currencyCode = $scope.currency.currencyCode;
      currency.currencyValue = $scope.currency.currencyValue;
      currency.currencyStandard = $scope.currency.currencyStandard;

      currency.$update(function () {
        $scope.success = 'You successfully updated your currency option.';

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Currencys
    $scope.find = function () {
      $scope.currencys = Currencys.query({
        'user': $scope.authentication.user._id
      });

      Currencys.query({
        'user': $scope.authentication.user._id
      }, function(currency) {

        $scope.currencys = currency;

        angular.forEach(currency,function(value,index){

          if (value.currencyStandard === true){
            $scope.currencyStandard = value;
          }

        });
      });
    };

    // Find existing Currency
    $scope.findOne = function () {
      $scope.currency = Currencys.get({
        currencyId: $stateParams.currencyId
      });

    };

    $scope.updateCurrencyStandard = function () {
      $scope.error = null;

      var currency = {};

      angular.forEach($scope.currencys,function(value,index){

        if (value === $scope.currencyStandard){

          currency = $scope.currencyStandard;
          currency.currencyStandard = true;

          currency.$update(function () {
            $scope.success = 'You successfully updated your currency option.';

          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        } else {

          currency = value;
          currency.currencyStandard = false;

          currency.$update(function () {
            $scope.success = 'You successfully updated your currency option.';

          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }

      });


    };
  }
]);
