'use strict';

angular.module('core').controller('HomeController', ['$scope', '$route', '$location', '$state', '$http', 'Authentication', 'OrdersServices', 'Orders',

  function ($scope, $route, $location, $state, $http, Authentication, OrdersServices, Orders) {

    // better set show status of nav
    $scope.navHide = false;

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
        $state.go('authentication.signin', $state.previous.params);
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
      var totalFacebook = 0;
      var totalTwitter = 0;
      var totalInstagram = 0;
      var totalPinterest = 0;
      var totalCode = 0;
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
            if(order.orderChannel === 'facebook')
            { totalFacebook += parseFloat(order.orderShipToTotalAmount); }
            if(order.orderChannel === 'twitter')
            { totalTwitter += parseFloat(order.orderShipToTotalAmount); }
            if(order.orderChannel === 'pinterest')
            { totalPinterest += parseFloat(order.orderShipToTotalAmount); }
            if(order.orderChannel === 'instagram')
            { totalInstagram += parseFloat(order.orderShipToTotalAmount); }
            if(order.orderChannel === 'code')
            { totalCode += parseFloat(order.orderShipToTotalAmount); }
          }
        }
        $scope.volTotalMonthFacebook = totalFacebook;
        $scope.volTotalMonthTwitter = totalTwitter;
        $scope.volTotalMonthPinterest = totalPinterest;
        $scope.volTotalMonthInstagram = totalInstagram;
        $scope.volTotalMonthCode = totalCode;

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
    $scope.getNoOrdersPerMonth1 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 1 && orderCreationYear === y){
          total += 1;
          totalVol += order.orderShipToTotalAmount;
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth1 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth1 - return:' +total);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    $scope.getNoOrdersPerMonth2 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 2 && orderCreationYear === y){
          total += 1;
          totalVol += order.orderShipToTotalAmount;
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth2 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth2 - return:' +total);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth3 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 3 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth3 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth3 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth4 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 4 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth4 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth4 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth5 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 5 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth5 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth5 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth6 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 6 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth6 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth6 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth7 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 7 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth7 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth7 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth8 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 8 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth8 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth8 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth9 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 9 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth9 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth9 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth10 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 10 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth10 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth10 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth11 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 11 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth11 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth11 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

    // Helper - orders per month for graph only
    $scope.getNoOrdersPerMonth12 = function(){
      var total = 0;
      var totalVol = 0;
      var dat = new Date();

      var y = dat.getYear();

      for(var i = 0; i < $scope.ordersForCalcs.length; i++){
        var order = $scope.ordersForCalcs[i];
        var orderCreationDate = new Date(order.created);

        var orderCreationMonth = orderCreationDate.getMonth()+1;
        var orderCreationYear = orderCreationDate.getYear();

        if(orderCreationMonth === 12 && orderCreationYear === y){
          total += 1;
          totalVol += parseInt(order.orderShipToTotalAmount, 10);
        }
      }
      console.log('home.client.controller - getNoOrdersPerMonth12 - noOrders:' +total);
      console.log('home.client.controller - getNoOrdersPerMonth12 - return:' +totalVol);
      $scope.noOrdersPerMonth = parseInt(total, 10);
      $scope.volOrdersPerMonth = parseInt(totalVol, 10);

      return totalVol;
    };

  }

]);
