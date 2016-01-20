'use strict';

angular.module('users').controller('AuthenticationController', ['$route', '$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Currencys', 'Deliverys','Taxes', 'UServices', 'Users', '$filter', '$timeout',
  function ($route, $scope, $state, $http, $location, $window, Authentication, PasswordValidator, Currencys, Deliverys, Taxes, UServices, Users, $filter, $timeout) {

    console.log("authentication.client.controller - load - verify activation id set: " +$location.search().id);

    // check if verification call
    if(!angular.isUndefined($location.search().id)) {
      // activation call
      var activationId = $location.search().id;

      // check if activate or cancel
      if(activationId.substring(0,6) === 'cancel') {
        // delete user credentials
        UServices.getUser(activationId.substring(6), function(user) {
          user.$remove(function (response) {
          }, function (errorResponse) {
          });
        }, function (errorResponse) {
        });
        console.log("authentication.client.controller - load - email is verified - user deleted due to cancel");
      } else {
        // verify if activationId exist in DB
        console.log("authentication.client.controller - load - verify user activation id");

        // verify that activation id is available
        $http.get('/api/auth/userbyactivateurl?activateURL=' +$location.search().id, {
          activateURL: $location.search().id
        }).success(function(response, status, headers, config) {
          if(response){
            console.log('authentication.client.controller - load - got user with activationid:' +response._id);
            // user still in db for activation - activate now

            // send welcome eMail
            $http.put('/api/auth/updateactivateuser?activateURL=' +$location.search().id, {
            }).success(function(data, status, headers, config) {

              // send welcome message
              console.log("authentication.client.controller - load - sendwelcomeemail - start");
              $scope.success = 'Your account is now active please log in and start selling!';
              // send welcome eMail
              $http.post('/api/auth/sendwelcomeemail', {
                usereMail: response.email

              }).success(function(data, status, headers, config) {
                $scope.authentication = null;
                $scope.user = null;
                $scope.navHide = true;
                $location.path('/');

                // send welcome message
                console.log("authentication.client.controller - load - sendwelcomeemail - success");
              });

             }).error(function(errorresponse) {
               $scope.error = errorresponse.msg;
               console.log("authentication.client.controller - load - sendwelcomeemail - error");
             });

            } else {
            // message code no longer active
            // ToDo link should be provided to reactivate
            $scope.error = 'Your registration data is no longer active and therefore was deleted. Please sign up again.';
            console.log("authentication.client.controller - email is verified - no longer acitve");
          }
        }).error(function(response, status, headers, config) {
          $scope.error = 'Your registration data is no longer active and therefore was deleted. Please sign up again.';
          console.log("authentication.client.controller - email is verified - no longer acitve");
        });
      }
    } else {

      console.log("authentication.client.controller - load page - no activation id set");
      $scope.authentication = Authentication;
      $scope.popoverMsg = PasswordValidator.getPopoverMsg();

      // Get an eventual error defined in the URL query string:
      $scope.error = $location.search().err;

      // If user is signed in then redirect back home
      if ($scope.authentication.user) {
        $location.path('/');
      }
    }

    $scope.signup = function (isValid) {
      console.log("authentication.client.controller - sign up - start");
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        console.log("authentication.client.controller - sign up - successfull called signup");
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

        // logout user due to activation process
        $http.get('/api/auth/signout', $scope.credentials).success(function (response) {
          console.log('authentication.client.controller - signup - logged out user');
          $scope.authentication = null;
          $scope.user = null;
          $scope.navHide = true;
        }).error(function (response) {
          $scope.error = response.message;
        });


        // Send eMail for activation
        var currentDate = new Date();
        $http.post('/api/auth/sendactivateemail', {
          usereMail: $scope.credentials.email,
          userDate: $filter('date')(currentDate, 'short', 'de_DE')

        }).success(function(data, status, headers, config) {
          console.log('authentication.client.controller - signup - sendactivationmail - success ' +data.activateURL);

          var registerUser = new Users({
            activateURL: data.activateURL
          });

          // save activation link
          registerUser.$update(function (response) {
            // Show message to verify eMail account
            // logout user due to activation process
            $http.get('/api/auth/signout', $scope.credentials).success(function (response) {
              console.log('authentication.client.controller - signup - logged out user after update');
              $scope.authentication = null;
              $scope.user = null;
              $scope.navHide = true;
              $scope.success = 'You successfully signed up at mightymerce. Please check your eMail account - we just send you a verification eMail.';

            }).error(function (response) {
              $scope.error = response.message;
            });
          }, function (errorResponse) {
          });
        });

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
      console.log('authentication.client.controller - signin - start');
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful
        // verify if entered userid is already activated
        if($scope.authentication.user.userStatus === '0' || $scope.authentication.user.userStatus){
          $http.get('/api/auth/signout', $scope.credentials).success(function (response) {
            console.log('authentication.client.controller - signin - logged out user after update');
            $scope.authentication = null;
            $scope.user = null;
            $scope.navHide = true;
            $scope.error = 'You have not activate your account yet. Please verify your eMail for activation information.';
          }).error(function (response) {
            $scope.error = response.message;
          });
        } else {
          // we assign the response to the global user model
          $scope.authentication.user = response;

          // And redirect to the previous or home page
          $state.go('dashboard', $state.previous.params);
        }
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
