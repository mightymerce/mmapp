'use strict';

angular.module('core').controller('HomeController', ['$scope', '$route', '$location', '$state', 'Authentication', 'OrdersServices', 'Orders',

  function ($scope, $route, $location, $state, Authentication, OrdersServices, Orders) {

    $route.reload();

    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Find existing Order for logged in User
    $scope.initDashboard = function () {
      // This provides Authentication context.
      $scope.authentication = Authentication;

      console.log('home.client.controller - onLoad - scope.authentication.user: '+ $scope.authentication.user);

      // If user is signed in then redirect back home
      if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      }
      else {
        console.log('home.client.controller - initDashboard - getOrders');

        Orders.query({ user:$scope.authentication.user._id }, function(orders) {
          console.log('home.client.controller - initDashboard - getOrders' +orders.length);
          $scope.orders = orders;
          $scope.ordersForCalcs = orders;
        });

        // set figures
        angular.forEach($scope.orders, function(value, key){

          if(value.orderStatus === 'CREATED')
          {
            $scope.noOpenOrders += 1;
          }
        });
      }
    };


    // Helper - calc. orders sum
    $scope.getTotalOrderVolume = function(){
      var total = 0;
      var d = new Date();
      var m = d.getMonth();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);
        var orderCreationMonth = orderCreationDate.getMonth();

        if(orderCreationMonth === m){
          total += parseFloat(order.orderShipToTotalAmount);
        }
      }
      return total;
    };

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

    // Helper - orders per month
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
