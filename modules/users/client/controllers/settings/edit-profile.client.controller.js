'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Deliverys', 'Authentication', 'stripeCreateSubscription', 'stripeUpdateSubscription', 'stripeCancelSubscription',
  function ($scope, $http, $location, Users, Deliverys, Authentication, stripeCreateSubscription, stripeUpdateSubscription, stripeCancelSubscription) {
    console.log('edit-profile.client.controller - load - start');
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

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

    $scope.favouritePlan = true;
    $scope.downgradeSubscriptionBasic = false;
    $scope.downgradeSubscriptionProfessional = false;
    $scope.upgradeExistingSubscriptionProfessional = false;
    $scope.upgradeExistingSubscriptionUnlimited = false;
    $scope.upgradeSubscriptionProfessionalDefault = false;
    $scope.upgradeSubscriptionUnlimitedDefault = false;

    if($scope.authentication.user.subscriptionplan === ''){
      $scope.upgradeSubscriptionFree = true;
      $scope.yourPlanFree = true;
      $scope.upgradeSubscriptionProfessional = true;
      $scope.upgradeSubscriptionUnlimited = true;
    }
    else if($scope.authentication.user.subscriptionplan === 'mmbasic'){
      $scope.upgradeSubscriptionFree = false;
      $scope.upgradeSubscriptionBasic = false;
      $scope.upgradeSubscriptionBasicDefault = true;
      $scope.upgradeSubscriptionProfessional = false;
      $scope.upgradeSubscriptionUnlimited = false;
      $scope.yourPlanBasic = true;
      $scope.upgradeExistingSubscriptionProfessional = true;
      $scope.upgradeExistingSubscriptionUnlimited = true;

    }else if($scope.authentication.user.subscriptionplan === 'mmprofessional'){
      $scope.upgradeSubscriptionFree = false;
      $scope.upgradeSubscriptionBasic = false;
      $scope.downgradeSubscriptionBasic = true;
      $scope.upgradeSubscriptionProfessionalDefault = true;
      $scope.upgradeSubscriptionUnlimited = false;
      $scope.upgradeExistingSubscriptionUnlimited = true;
      $scope.yourPlanProfessional = true;
      $scope.favouritePlan = false;

    }else if($scope.authentication.user.subscriptionplan === 'mmunlimited'){
      $scope.upgradeSubscriptionFree = false;
      $scope.upgradeSubscriptionBasic = false;
      $scope.downgradeSubscriptionBasic = true;
      $scope.upgradeSubscriptionProfessional = false;
      $scope.downgradeSubscriptionProfessional = true;
      $scope.upgradeSubscriptionUnlimitedDefault = true;
      $scope.yourPlanUnlimited = true;
    }
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
      user.tutorialPaypalDetail = '1';

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

      console.log('edit-profile.client.controller - updateProfileDetails - start');
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
      user.tutorialCompanyDetail = '1';

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = 'You successfully updated your profile details.';
        Authentication.user = response;

        console.log('edit-profile.client.controller - updateProfileDetails - success');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
        console.log('edit-profile.client.controller - updateProfileDetails - error');
      });

      console.log('edit-profile.client.controller - updateProfileDetails - end');
    };


    // Call Stripe create / update subscription
    $scope.createStripeSubscriptionBasic = function (plan, tokenid, tokenemail) {
      console.log('edit-profile.client.controller - createStripeSubscriptionBasic - start');

      // Verify is it an upgrade / downgrade or new subscription

      if($scope.authentication.user.subscriptionplan === ''){
        stripeCreateSubscription.query({
          USER: tokenemail,
          PLAN: plan,
          TOKEN: tokenid
        }, function(customer) {

          $scope.subscriptioncusid = customer.customer;
          $scope.subscriptionsubid = customer.id;
          $scope.subscriptionemail = tokenemail;
          $scope.subscriptionplan = plan;

          // change customer status in MM DB
          var user = new Users($scope.user);
          user.subscriptioncusid = customer.customer;
          user.subscriptionsubid = customer.id;
          user.subscriptionemail = tokenemail;
          user.subscriptionplan = plan;

          user.$update(function (response) {
            Authentication.user = response;
            $scope.user = Authentication.user;

            $scope.favouritePlan = true;
            $scope.downgradeSubscriptionBasic = false;
            $scope.downgradeSubscriptionProfessional = false;
            $scope.upgradeExistingSubscriptionProfessional = false;
            $scope.upgradeExistingSubscriptionUnlimited = false;
            $scope.upgradeSubscriptionProfessionalDefault = false;
            $scope.upgradeSubscriptionUnlimitedDefault = false;

            if($scope.authentication.user.subscriptionplan === ''){
              $scope.upgradeSubscriptionFree = true;
              $scope.yourPlanFree = true;
              $scope.upgradeSubscriptionProfessional = true;
              $scope.upgradeSubscriptionUnlimited = true;
            }
            else if($scope.authentication.user.subscriptionplan === 'mmbasic'){
              $scope.upgradeSubscriptionFree = false;
              $scope.upgradeSubscriptionBasic = false;
              $scope.upgradeSubscriptionBasicDefault = true;
              $scope.upgradeSubscriptionProfessional = false;
              $scope.upgradeSubscriptionProfessionalDefault = false;
              $scope.upgradeSubscriptionUnlimited = false;
              $scope.yourPlanBasic = true;
              $scope.upgradeExistingSubscriptionProfessional = true;
              $scope.upgradeExistingSubscriptionUnlimited = true;
              $scope.upgradeSubscriptionUnlimitedDefault = false;
              $scope.yourPlanProfessional = false;
              $scope.yourPlanUnlimited = false;

            }else if($scope.authentication.user.subscriptionplan === 'mmprofessional'){
              $scope.upgradeSubscriptionFree = false;
              $scope.upgradeSubscriptionBasic = false;
              $scope.upgradeSubscriptionBasicDefault = false;
              $scope.downgradeSubscriptionBasic = true;
              $scope.upgradeSubscriptionProfessionalDefault = true;
              $scope.upgradeSubscriptionUnlimited = false;
              $scope.upgradeExistingSubscriptionUnlimited = true;
              $scope.upgradeSubscriptionUnlimitedDefault = false;
              $scope.yourPlanBasic = false;
              $scope.yourPlanProfessional = true;
              $scope.favouritePlan = false;

            }else if($scope.authentication.user.subscriptionplan === 'mmunlimited'){
              $scope.upgradeSubscriptionFree = false;
              $scope.upgradeSubscriptionBasic = false;
              $scope.downgradeSubscriptionBasic = true;
              $scope.upgradeSubscriptionProfessional = false;
              $scope.downgradeSubscriptionProfessional = true;
              $scope.upgradeSubscriptionProfessionalDefault = false;
              $scope.upgradeSubscriptionUnlimitedDefault = true;
              $scope.yourPlanBasic = false;
              $scope.yourPlanProfessional = false;
              $scope.yourPlanUnlimited = true;
            }

            console.log('edit-profile.client.controller - createStripeSubscriptionBasic - success update user MM DB');
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
            console.log('edit-profile.client.controller - createStripeSubscriptionBasic - error update user MM DB');
          });

          console.log('edit-profile.client.controller - createStripeSubscriptionBasic - end');

        });
      } else {
        // is an upgrade / downgrade
        console.log('edit-profile.client.controller - createStripeSubscriptionBasic - cusid: ' +$scope.authentication.user.subscriptioncusid);
        console.log('edit-profile.client.controller - createStripeSubscriptionBasic - subid: ' +$scope.authentication.user.subscriptionsubid);
        stripeUpdateSubscription.query({
          CUSID: $scope.authentication.user.subscriptioncusid,
          SUBID: $scope.authentication.user.subscriptionsubid,
          PLAN: plan
        }, function(customer) {

          $scope.subscriptioncusid = customer.customer;
          $scope.subscriptionsubid = customer.id;
          $scope.subscriptionplan = plan;

          // change customer status in MM DB
          var user = new Users($scope.user);
          user.subscriptioncusid = customer.customer;
          user.subscriptionsubid = customer.id;
          user.subscriptionplan = plan;

          user.$update(function (response) {
            Authentication.user = response;
            $scope.user = Authentication.user;

            $scope.favouritePlan = true;
            $scope.downgradeSubscriptionBasic = false;
            $scope.downgradeSubscriptionProfessional = false;
            $scope.upgradeExistingSubscriptionProfessional = false;
            $scope.upgradeExistingSubscriptionUnlimited = false;
            $scope.upgradeSubscriptionProfessionalDefault = false;
            $scope.upgradeSubscriptionUnlimitedDefault = false;

            if($scope.authentication.user.subscriptionplan === ''){
              $scope.upgradeSubscriptionFree = true;
              $scope.yourPlanFree = true;
              $scope.upgradeSubscriptionProfessional = true;
              $scope.upgradeSubscriptionUnlimited = true;
            }
            else if($scope.authentication.user.subscriptionplan === 'mmbasic'){
              $scope.upgradeSubscriptionFree = false;
              $scope.upgradeSubscriptionBasic = false;
              $scope.upgradeSubscriptionBasicDefault = true;
              $scope.upgradeSubscriptionProfessional = false;
              $scope.upgradeSubscriptionProfessionalDefault = false;
              $scope.upgradeSubscriptionUnlimited = false;
              $scope.yourPlanBasic = true;
              $scope.upgradeExistingSubscriptionProfessional = true;
              $scope.upgradeExistingSubscriptionUnlimited = true;
              $scope.upgradeSubscriptionUnlimitedDefault = false;
              $scope.yourPlanProfessional = false;
              $scope.yourPlanUnlimited = false;

            }else if($scope.authentication.user.subscriptionplan === 'mmprofessional'){
              $scope.upgradeSubscriptionFree = false;
              $scope.upgradeSubscriptionBasic = false;
              $scope.upgradeSubscriptionBasicDefault = false;
              $scope.downgradeSubscriptionBasic = true;
              $scope.upgradeSubscriptionProfessionalDefault = true;
              $scope.upgradeSubscriptionUnlimited = false;
              $scope.upgradeExistingSubscriptionUnlimited = true;
              $scope.upgradeSubscriptionUnlimitedDefault = false;
              $scope.yourPlanBasic = false;
              $scope.yourPlanProfessional = true;
              $scope.favouritePlan = false;

            }else if($scope.authentication.user.subscriptionplan === 'mmunlimited'){
              $scope.upgradeSubscriptionFree = false;
              $scope.upgradeSubscriptionBasic = false;
              $scope.downgradeSubscriptionBasic = true;
              $scope.upgradeSubscriptionProfessional = false;
              $scope.downgradeSubscriptionProfessional = true;
              $scope.upgradeSubscriptionProfessionalDefault = false;
              $scope.upgradeSubscriptionUnlimitedDefault = true;
              $scope.yourPlanBasic = false;
              $scope.yourPlanProfessional = false;
              $scope.yourPlanUnlimited = true;
            }

            console.log('edit-profile.client.controller - createStripeSubscriptionBasic - success update user MM DB');
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
            console.log('edit-profile.client.controller - createStripeSubscriptionBasic - error update user MM DB');
          });

          console.log('edit-profile.client.controller - createStripeSubscriptionBasic - end');

        });

      }
    };

    // Call Stripe cancel subscription
    $scope.cancelStripeSubscriptionBasic = function (plan, tokenid, tokenemail) {
      console.log('edit-profile.client.controller - cancelStripeSubscriptionBasic - start');

      // Verify is it an upgrade / downgrade or new subscription

      stripeCancelSubscription.query({
        CUSID: $scope.authentication.user.subscriptioncusid,
        SUBID: $scope.authentication.user.subscriptionsubid

      }, function(customer) {

        $scope.subscriptioncusid = customer.customer;
        $scope.subscriptionsubid = customer.id;
        $scope.subscriptionplan = '';

        // change customer status in MM DB
        var user = new Users($scope.user);
        user.subscriptioncusid = customer.customer;
        user.subscriptionsubid = customer.id;
        user.subscriptionplan = '';

        user.$update(function (response) {
          Authentication.user = response;
          $scope.user = Authentication.user;

          $scope.favouritePlan = true;
          $scope.downgradeSubscriptionBasic = false;
          $scope.downgradeSubscriptionProfessional = false;
          $scope.upgradeExistingSubscriptionProfessional = false;
          $scope.upgradeExistingSubscriptionUnlimited = false;
          $scope.upgradeSubscriptionProfessionalDefault = false;
          $scope.upgradeSubscriptionUnlimitedDefault = false;

          if($scope.authentication.user.subscriptionplan === ''){
            $scope.upgradeSubscriptionFree = true;
            $scope.yourPlanFree = true;
            $scope.upgradeSubscriptionProfessional = true;
            $scope.upgradeSubscriptionUnlimited = true;
          }
          else if($scope.authentication.user.subscriptionplan === 'mmbasic'){
            $scope.upgradeSubscriptionFree = false;
            $scope.upgradeSubscriptionBasic = false;
            $scope.upgradeSubscriptionBasicDefault = true;
            $scope.upgradeSubscriptionProfessional = false;
            $scope.upgradeSubscriptionProfessionalDefault = false;
            $scope.upgradeSubscriptionUnlimited = false;
            $scope.yourPlanBasic = true;
            $scope.upgradeExistingSubscriptionProfessional = true;
            $scope.upgradeExistingSubscriptionUnlimited = true;
            $scope.upgradeSubscriptionUnlimitedDefault = false;
            $scope.yourPlanProfessional = false;
            $scope.yourPlanUnlimited = false;

          }else if($scope.authentication.user.subscriptionplan === 'mmprofessional'){
            $scope.upgradeSubscriptionFree = false;
            $scope.upgradeSubscriptionBasic = false;
            $scope.upgradeSubscriptionBasicDefault = false;
            $scope.downgradeSubscriptionBasic = true;
            $scope.upgradeSubscriptionProfessionalDefault = true;
            $scope.upgradeSubscriptionUnlimited = false;
            $scope.upgradeExistingSubscriptionUnlimited = true;
            $scope.upgradeSubscriptionUnlimitedDefault = false;
            $scope.yourPlanBasic = false;
            $scope.yourPlanProfessional = true;
            $scope.favouritePlan = false;

          }else if($scope.authentication.user.subscriptionplan === 'mmunlimited'){
            $scope.upgradeSubscriptionFree = false;
            $scope.upgradeSubscriptionBasic = false;
            $scope.downgradeSubscriptionBasic = true;
            $scope.upgradeSubscriptionProfessional = false;
            $scope.downgradeSubscriptionProfessional = true;
            $scope.upgradeSubscriptionProfessionalDefault = false;
            $scope.upgradeSubscriptionUnlimitedDefault = true;
            $scope.yourPlanBasic = false;
            $scope.yourPlanProfessional = false;
            $scope.yourPlanUnlimited = true;
          }

          console.log('edit-profile.client.controller - cancelStripeSubscriptionBasic - success update user MM DB');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
          console.log('edit-profile.client.controller - cancelStripeSubscriptionBasic - error update user MM DB');
        });

        console.log('edit-profile.client.controller - cancelStripeSubscriptionBasic - end');

        });
    };
  }
]);
