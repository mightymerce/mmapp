'use strict';

// Products controller
angular.module('products').controller('ProductsChannelController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$modal', 'Posts', 'ProductsServices', 'FileUploader',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $modal, Posts, ProductsServices, FileUploader) {

    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    console.log('productschannel.client.controller - load ProductsChannelController');

    // Load user products
    $scope.findUserProducts = function () {
      $scope.products = Products.query({
        'user': $scope.authentication.user._id
      });

      $scope.product = Products.get({
        productId: $stateParams.productId
      });

      $scope.productSelectId = $stateParams.productId;
    };


    // Update existing Product
    $scope.update = function (isValid) {
      console.log('productschannel.client.controller - update - start');
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'productForm');

        return false;
      }

      // Todo get the selected products and store

      var product = $scope.product;

      product.$update(function () {
        $scope.success = 'Successfully changed data';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      console.log('productschannel.client.controller - update - end');
    };

    // Find existing Products
    $scope.findOne = function () {
      $scope.product = Products.get({
        productId: $stateParams.productId
      });

      ProductsServices.getPosts($stateParams.productId).then(function (Posts) {
        $scope.posts = Posts;
      });
    };
  }
]);
