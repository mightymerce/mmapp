'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Posts', 'Products', 'ProductsServices',
  function ($scope, $state, $stateParams, $location, Authentication, Posts, Products, ProductsServices) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    // Create new Post
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'postForm');

        return false;
      }

      // Create new Post object
      var post = new Posts({
        postId: this.postId,
        postStatus: this.postStatus,
        postPublicationDate: this.postPublicationDate,
        postExternalPostKey: this.postExternalPostKey
      });

      // Redirect after save
      post.$save(function (response) {
        $location.path('posts/' + response._id);

        // Clear form fields
        $scope.postId = '';
        $scope.postDate = '';
        $scope.postCustomer = '';
        $scope.postStatus = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Post
    $scope.remove = function (post) {
      if (post) {
        post.$remove();

        for (var i in $scope.posts) {
          if ($scope.posts[i] === post) {
            $scope.posts.splice(i, 1);
          }
        }
      } else {
        $scope.post.$remove(function () {
          $location.path('posts');
        });
      }
    };

    // Update existing Post
    $scope.update = function (isValid) {
      $scope.error = null;

      console.log('Post Update');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'postForm');

        return false;
      }

      var post = $scope.post;

      post.$update(function () {
        $location.path('posts/' + post._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Posts
    $scope.find = function () {
      // If user is signed in then redirect back home
      if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      }
      else {
        console.log('posts.client.controller - find - authenticated user: ' +$scope.authentication.user._id);
        $scope.posts = Posts.query({ 'user': $scope.authentication.user._id });
      }
    };

    // Find existing Post
    $scope.findOne = function () {
      $scope.post = Posts.get({
        postId: $stateParams.postId
      });
    };

    // Find a list of Products
    $scope.findProducts = function () {
      ProductsServices.getProducts().then(function (Products) {
        $scope.products = Products;
      });
    };
  }
]);
