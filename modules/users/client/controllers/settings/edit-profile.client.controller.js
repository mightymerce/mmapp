'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Deliverys', 'Authentication',
  function ($scope, $http, $location, Users, Deliverys, Authentication) {
    console.log('edit-profile.client.controller - load - start');
    $scope.user = Authentication.user;

    console.log('edit-profile.client.controller - load - end');


    // Update a user profile
    $scope.updatePaymentDetails = function (isValid) {

      console.log('edit-profile.client.controller - updatePaymentDetails - start');
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);
      user.paypalUser = $scope.user.paypalUser;
      user.paypalPwd = $scope.user.paypalPwd;
      user.paypalSignature = $scope.user.paypalSignature;

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = 'You successfully updated your payment details.';
        Authentication.user = response;

        console.log('edit-profile.client.controller - updatePaymentDetails - success');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        console.log('edit-profile.client.controller - updatePaymentDetails - error');
      });

      console.log('edit-profile.client.controller - updatePaymentDetails - end');
    };

    // Update a user profile
    $scope.updateProfileDetails = function (isValid) {

      console.log('edit-profile.client.controller - updatePaymentDetails - start');
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);
      user.displayName = $scope.user.displayName;
      user.firstName = $scope.user.firstName;
      user.lastName = $scope.user.lastName;
      user.street = $scope.user.street;
      user.streetno = $scope.user.streetno;
      user.zipcode = $scope.user.zipcode;
      user.city = $scope.user.city;

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = 'You successfully updated your profile details.';
        Authentication.user = response;

        console.log('edit-profile.client.controller - updatePaymentDetails - success');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        console.log('edit-profile.client.controller - updatePaymentDetails - error');
      });

      console.log('edit-profile.client.controller - updatePaymentDetails - end');
    };

  }
]);
