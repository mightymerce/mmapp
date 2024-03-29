'use strict';

// Legals controller
angular.module('legals').controller('LegalsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Legals', 'Users',
  function ($scope, $stateParams, $location, $http, Authentication, Legals, Users) {
    $scope.authentication = Authentication;

    // check if all tutorial fields are set
    if ($scope.authentication.user.tutorialCompanyDetail === '1' &&
        $scope.authentication.user.tutorialLegalDetail === '1' &&
        $scope.authentication.user.tutorialPaypalDetail === '1' &&
        $scope.authentication.user.tutorialDeliveryDetail === '1' &&
        $scope.authentication.user.tutorialProductDetail === '1') {
      // Load Tutorial
      $scope.basicData = true;
    } else {
      $scope.basicData = false;
    }

    $scope.$watch('basicData', function() {
    });

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
        legalCopyright: this.legalCopyright
      });

      // Redirect after save
      legal.$save(function (response) {
        // in case create update for tutorial
        if ($scope.authentication.user.tutorialLegalDetail === '0') {
          var user = new Users($scope.user);
          user.tutorialLegalDetail = '1';

          user.$update(function (response) {
            console.log('edit-profile.client.controller - updateUser - tutorial flag');
            $scope.authentication.user.tutorialLegalDetail = '1';
            Authentication.user.tutorialLegalDetail = '1';
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
        // in case create update for tutorial
        if ($scope.authentication.user.tutorialLegalDetail === '0') {
          var user = new Users($scope.user);

          // in case all fields are filled set flag for legals to '1'
          if ($scope.legal.legalPrivacyPolicy !== "" &&
            $scope.legal.legalReturnPolicy !== "" &&
            $scope.legal.legalTermsandConditions !== "" &&
            $scope.legal.legalImprint !== "" &&
            $scope.legal.legalCopyright !== "") {

            user.tutorialLegalDetail = '1';

            user.$update(function (response) {
              console.log('edit-profile.client.controller - updateUser - tutorial flag');
              $scope.authentication.user.tutorialLegalDetail = '1';
              Authentication.user.tutorialLegalDetail = '1';
            }, function (errorResponse) {
              console.log('edit-profile.client.controller - updateUser - tutorial flag error');
            });
          }
        }
        $scope.success = 'You successfully updated your legal option.';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Legals
    $scope.find = function () {

      var legal = Legals.get({
        user: $scope.authentication.user._id
      });
      $scope.legal = legal;
    };

    // Find existing Legal
    $scope.findOne = function () {
      $scope.legal = Legals.get({
        legalId: $stateParams.legalId
      });
    };
  }
]);
