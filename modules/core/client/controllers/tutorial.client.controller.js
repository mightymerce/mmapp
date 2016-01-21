'use strict';

angular.module('core').controller('TutorialController', ['$scope', '$route', '$location', '$state', 'Authentication', 'OrdersServices', 'Orders',

  function ($scope, $route, $location, $state, Authentication, OrdersServices, Orders) {

    // This provides Authentication context.
    //$scope.authentication = Authentication;

    // Find existing Order for logged in User
    $scope.initHome = function () {
      // This provides Authentication context.
      $scope.authentication = Authentication;

      console.log('tutorial.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user);

      console.log('tutorial.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user.tutorialCompanyDetail);
      console.log('tutorial.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user.tutorialLegalDetail);
      console.log('tutorial.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user.tutorialPaypalDetail);
      console.log('tutorial.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user.tutorialDeliveryDetail);
      console.log('tutorial.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user.tutorialProductDetail);


      // If user is signed in then redirect back home
      if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      } else if ($scope.authentication.user.tutorialCompanyDetail === '1' &&
          $scope.authentication.user.tutorialLegalDetail === '1' &&
          $scope.authentication.user.tutorialPaypalDetail === '1' &&
          $scope.authentication.user.tutorialDeliveryDetail === '1' &&
          $scope.authentication.user.tutorialProductDetail === '1') {
        // Load Tutorial
        $state.go('dashboard', $state.previous.params);
      } else {
        // Load Tutorial
        console.log('home.client.controller - initTutorial - start');
        $scope.basicData = false;

        if ($scope.authentication.user.tutorialCompanyDetail === '0') {
          $scope.showCompanyDetailsComplete = false;
          $scope.showCompanyDetails = true;
        } else {
          $scope.showCompanyDetailsComplete = true;
          $scope.showCompanyDetails = false;
        }

        if ($scope.authentication.user.tutorialLegalDetail !== '0') {
          $scope.showLegalDetailsComplete = true;
          $scope.showLegalDetails = false;
        } else {
          $scope.showLegalDetailsComplete = false;
          $scope.showLegalDetails = true;
        }

        if ($scope.authentication.user.tutorialPaypalDetail !== '0') {
          $scope.showPaypalDetailsComplete = true;
          $scope.showPaypalDetails = false;
        } else {
          $scope.showPaypalDetailsComplete = false;
          $scope.showPaypalDetails = true;
        }

        if ($scope.authentication.user.tutorialDeliveryDetail !== '0') {
          $scope.showDeliveryDetailsComplete = true;
          $scope.showDeliveryDetails = false;
        } else {
          $scope.showDeliveryDetailsComplete = false;
          $scope.showDeliveryDetails = true;
        }

        if ($scope.authentication.user.tutorialProductDetail !== '0') {
          $scope.showProductCreateComplete = true;
          $scope.showProductCreate = false;
        } else {
          $scope.showProductCreateComplete = false;
          $scope.showProductCreate = true;
        }
      }
    };

    /*
    // Helper - orders per day and sales volume
    $scope.getNoOrdersPerDay = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();
      var d = dat.getDay();
      var m = dat.getMonth();
      var y = dat.getYear();

      console.log('home.client.controller - getNoOrdersPerDay - noOrders:' +$scope.ordersForCalcs.length);

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);
        var orderCreationDay = orderCreationDate.getDay();
        var orderCreationMonth = orderCreationDate.getMonth();
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationDay === d && orderCreationMonth === m && orderCreationYear === y){
          total += 1;
          totalVol += order.orderShipToTotalAmount;
        }
      }
      console.log('home.client.controller - getNoOrdersPerDay - return:' +total);
      $scope.noOrdersPerDay = total;
      $scope.volOrdersPerDay = totalVol;
      return total;
    };
    */
  }

]);
