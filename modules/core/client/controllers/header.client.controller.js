'use strict';

angular.module('core').controller('HeaderController', ['$http', '$scope', '$state', '$location', 'Authentication', 'Menus', 'Orders',
  function ($http, $scope, $state, $location, Authentication, Menus, Orders) {

    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    $scope.noOpenOrders = 0;

    if ($scope.authentication.user) {
      Orders.query({ user:$scope.authentication.user._id }, function(orders) {
        console.log('header.client.controller - onLoad - getOrders' +orders.length);
        $scope.orders = orders;

        angular.forEach($scope.orders, function(value, key){
          if(value.orderStatus === 'CREATED')
          {
            $scope.noOpenOrders += 1;
          }
        });
      });
    }

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // For checkout get rid of Navigation
    var path = $location.path();

    console.log($state);

    if (path.includes('/checkouts') || path.includes('/authentication') || $scope.authentication === null) {
      $scope.navHide = true;
      $scope.footHide = true;
    }

    $scope.signout = function () {
      $scope.error = null;

      $http.get('/api/auth/signout').success(function (response) {

        $scope.authentication = null;

        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);

      }).error(function (response) {
        $scope.error = response.message;
      });

    };
  }
]);
