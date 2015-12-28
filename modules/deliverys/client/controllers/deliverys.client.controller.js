'use strict';

// Deliverys controller
angular.module('deliverys').controller('DeliverysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Deliverys',
  function ($scope, $stateParams, $location, Authentication, Deliverys) {
    $scope.authentication = Authentication;

    // Create new Delivery
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'deliveryForm');

        return false;
      }

      // Create new Delivery object
      var delivery = new Deliverys({
        deliveryTitle: this.deliveryTitle,
        deliveryTime: this.deliveryTime,
        deliveryCountry: this.deliveryCountry,
        deliveryCost: this.deliveryCost
      });

      // Redirect after save
      delivery.$save(function (response) {
        $scope.success = 'You successfully created a delivery option.';
        $location.path('deliverys/' + response._id + '/edit');

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Delivery
    $scope.remove = function (delivery) {
      if (delivery) {
        delivery.$remove();

        for (var i in $scope.deliverys) {
          if ($scope.deliverys[i] === delivery) {
            $scope.deliverys.splice(i, 1);
          }
        }
      } else {
        $scope.delivery.$remove(function () {
          $location.path('deliverys');
        });
      }
    };

    // Update existing Delivery
    $scope.update = function (isValid) {
      console.log('delivery.client.controller - update - start');
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'deliveryForm');

        return false;
      }

      var delivery = $scope.delivery;

      delivery.deliveryTitle = $scope.delivery.deliveryTitle;
      delivery.deliveryTime = $scope.delivery.deliveryTime;
      delivery.deliveryCountry = $scope.delivery.deliveryCountry;
      delivery.deliveryCost = $scope.delivery.deliveryCost;

      console.log('delivery.client.controller - update - scope deliver object: ' +$scope.delivery.deliveryTitle);

      delivery.$update(function () {
        $scope.success = 'You successfully updated your delivery option.';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Deliverys
    $scope.find = function () {
      $scope.deliverys = Deliverys.query(
      { 'user': $scope.authentication.user._id }
      );
    };

    // Find existing Delivery
    $scope.findOne = function () {
      $scope.delivery = Deliverys.get({
        deliveryId: $stateParams.deliveryId
      });
    };
  }
]);
