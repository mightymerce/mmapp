'use strict';

// Legals controller
angular.module('legals').controller('LegalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Legals',
  function ($scope, $stateParams, $location, Authentication, Legals) {
    $scope.authentication = Authentication;

    // Create new Legal
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'legalForm');

        return false;
      }

      // Create new Legal object
      var legal = new Legals({
        legalTitle: this.legalTitle,
        legalTime: this.legalTime,
        legalCountry: this.legalCountry,
        legalCost: this.legalCost
      });

      // Redirect after save
      legal.$save(function (response) {
        $scope.success = 'You successfully created a legal option.';
        $location.path('legals/' + response._id + '/edit');

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Legal
    $scope.remove = function (legal) {
      if (legal) {
        legal.$remove();

        for (var i in $scope.legals) {
          if ($scope.legals[i] === legal) {
            $scope.legals.splice(i, 1);
          }
        }
      } else {
        $scope.legal.$remove(function () {
          $location.path('legals');
        });
      }
    };

    // Update existing Legal
    $scope.update = function (isValid) {
      console.log('legal.client.controller - update - start');
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'legalForm');

        return false;
      }

      var legal = $scope.legal;

      legal.legalTitle = $scope.legal.legalTitle;
      legal.legalTime = $scope.legal.legalTime;
      legal.legalCountry = $scope.legal.legalCountry;
      legal.legalCost = $scope.legal.legalCost;

      console.log('legal.client.controller - update - scope deliver object: ' +$scope.legal.legalTitle);

      legal.$update(function () {
        $scope.success = 'You successfully updated your legal option.';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Legals
    $scope.find = function () {
      $scope.legals = Legals.query(
      { user:$scope.authentication.user._id }
      );
    };

    // Find existing Legal
    $scope.findOne = function () {
      $scope.legal = Legals.get({
        legalId: $stateParams.legalId
      });
    };
  }
]);
