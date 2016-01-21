'use strict';

angular.module('core').controller('HomeController', ['$scope', '$route', '$location', '$state', '$http', 'Authentication', 'OrdersServices', 'Orders',

  function ($scope, $route, $location, $state, $http, Authentication, OrdersServices, Orders) {

    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Find existing Order for logged in User
    $scope.initHome = function () {
      // This provides Authentication context.
      $scope.authentication = Authentication;
      console.log('home.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user);

      $scope.date = new Date();

      if ($scope.authentication.user.tutorialCompanyDetail === '0' ||
          $scope.authentication.user.tutorialLegalDetail === '0' ||
          $scope.authentication.user.tutorialPaypalDetail === '0' ||
          $scope.authentication.user.tutorialDeliveryDetail === '0' ||
          $scope.authentication.user.tutorialProductDetail === '0') {
        // Load Tutorial
        $state.go('tutorial', $state.previous.params);
      }
      // If user is signed in then redirect back home
      else if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      } else {
        // Load Dashboard
        $scope.basicData = true;
        console.log('home.client.controller - initDashboard - getOrders');

        $http.get('/api/orders?user=' +$scope.authentication.user._id).success(function (response) {
          console.log('home.client.controller - initDashboard - getOrders' +response);
          $scope.orders = response;
          $scope.ordersForCalcs = response;

          // Set TotalOrderVolume
          $scope.totalOrderVolume = getTotalOrderVolume(response);

          // Set NoOrdersPerDay
          $scope.noOrdersPerDay = getNoOrdersPerDay(response);

          // Set NoOrdersPerMonth
          $scope.noOrdersPerMonth = getNoOrdersPerMonth(response);

          // set figures
          angular.forEach($scope.orders, function(value, key){

            if(value.orderStatus === 'CREATED')
            {
              $scope.noOpenOrders += 1;
            }
          });

        }).error(function (response) {
          $scope.error = response.message;
        });
      }
    };


    // Helper - calc. orders sum
    function getTotalOrderVolume(ordersForCalcs) {
      console.log('Start getTotalOderVolume');
      var total = 0;
      var d = new Date();
      var m = d.getMonth();

      console.log('Start getTotalOderVolume: '+ ordersForCalcs.length);

      if(!ordersForCalcs.length)
      {
        return 0;
      } else {
        for(var i = 0; i < ordersForCalcs.length; i++){
          var order = ordersForCalcs[i];
          var orderCreationDate = new Date(order.created);
          var orderCreationMonth = orderCreationDate.getMonth();

          if(orderCreationMonth === m){
            total += parseFloat(order.orderShipToTotalAmount);
          }
        }
        return total;
      }
    }

    // Helper - orders per day and sales volume
    function getNoOrdersPerDay(ordersForCalcs) {

      if(ordersForCalcs.length)
      {
        var total = 0;
        var totalVol = 0;
        var dat = new Date();
        var d = dat.getDay();
        var m = dat.getMonth();
        var y = dat.getYear();

        console.log('home.client.controller - getNoOrdersPerDay - noOrders:' +ordersForCalcs.length);

        for(var i = 0; i < ordersForCalcs.length; i++){
          var order = ordersForCalcs[i];
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
      } else {
        return 0;
      }
    }

    // Helper - orders per month
    function getNoOrdersPerMonth(ordersForCalcs) {
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var m = dat.getMonth();
      var y = dat.getYear();

      console.log('home.client.controller - getNoOrdersPerMonth - noOrders:' +ordersForCalcs.length);


      for(var i = 0; i < ordersForCalcs.length; i++){
        var order = ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth();
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === m && orderCreationYear === y){
          total += 1;
          totalVol += order.orderShipToTotalAmount;
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth - return:' +total);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return total;
    }


    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var m = dat.getMonth();
      var y = dat.getYear();

      console.log('home.client.controller - getNoOrdersPerMonth - noOrders:' +$scope.ordersForCalcs.length);


      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth();
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === m && orderCreationYear === y){
          total += 1;
          totalVol += order.orderShipToTotalAmount;
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth - return:' +total);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return total;
    };

  }

]);
