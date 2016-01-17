'use strict';

// Legals controller
angular.module('legals').controller('LegalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Legals', 'Users',
  function ($scope, $stateParams, $location, Authentication, Legals, Users) {
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
        legalPrivacyPolicy: this.legalPrivacyPolicy,
        legalReturnPolicy: this.legalReturnPolicy,
        legalTermsandConditions: this.legalTermsandConditions,
        legalImprint: this.legalImprint,
        legalCopyright: this.legalCopyright,
      });

      // Redirect after save
      legal.$save(function (response) {
        // in case create update for tutorial
        if ($scope.authentication.user.tutorialLegalDetail === '0') {
          var user = new Users($scope.user);
          user.tutorialLegalDetail = '1';

          user.$update(function (response) {
            console.log('edit-profile.client.controller - updateUser - tutorial flag');
          }, function (errorResponse) {
            console.log('edit-profile.client.controller - updateUser - tutorial flag error');
          });
        }
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

      legal.legalPrivacyPolicy = $scope.legal.legalPrivacyPolicy;
      legal.legalReturnPolicy = $scope.legal.legalReturnPolicy;
      legal.legalTermsandConditions = $scope.legal.legalTermsandConditions;
      legal.legalImprint = $scope.legal.legalImprint;
      legal.legalCopyright = $scope.legal.legalCopyright;

      legal.$update(function () {
        $scope.success = 'You successfully updated your legal option.';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Legals
    $scope.find = function () {
      console.log('legals.client.controller - find - user id: ' +$scope.authentication.user._id);
      $scope.legals = Legals.query({
        'user': $scope.authentication.user._id
      });
      console.log('legals.client.controller - find - legalCopyright: ' +$scope.legalCopyright);
      console.log('legals.client.controller - find - legal.legalCopyright: ' +$scope.legals.legalCopyright);
    };

    // Find existing Legal
    $scope.findOne = function () {
      $scope.legal = Legals.get({
        legalId: $stateParams.legalId
      });
    };
  }
]);
