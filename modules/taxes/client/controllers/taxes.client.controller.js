'use strict';

// Taxes controller
angular.module('taxes').controller('TaxesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Taxes',
  function ($scope, $stateParams, $location, Authentication, Taxes) {
    $scope.authentication = Authentication;

    // Create new Taxe
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'taxeForm');

        return false;
      }

      // Create new Taxe object
      var taxe = new Taxes({
        taxCountry: this.taxCountry,
        taxRate: this.taxRate
      });

      // Redirect after save
      taxe.$save(function (response) {
        $scope.success = 'You successfully created a tax option.';
        $location.path('taxes/' + response._id + '/edit');

        // Clear form fields
        $scope.taxCountry = '';
        $scope.taxRate = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Taxe
    $scope.remove = function (taxe) {
      if (taxe) {
        taxe.$remove();

        for (var i in $scope.taxes) {
          if ($scope.taxes[i] === taxe) {
            $scope.taxes.splice(i, 1);
          }
        }
      } else {
        $scope.taxe.$remove(function () {
          $location.path('taxes');
        });
      }
    };

    // Update existing Taxe
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'taxeForm');

        return false;
      }

      var taxe = $scope.taxe;

      taxe.taxCountry = $scope.taxe.taxCountry;
      taxe.taxRate = $scope.taxe.taxRate;

      taxe.$update(function () {
        $scope.success = 'You successfully updated your tax option.';

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Taxes
    $scope.find = function () {
      $scope.taxes = Taxes.query({
        'user': $scope.authentication.user._id
      });
    };

    // Find existing Taxe
    $scope.findOne = function () {
      $scope.taxe = Taxes.get({
        taxesId: $stateParams.taxesId
      });
    };
  }
]);
