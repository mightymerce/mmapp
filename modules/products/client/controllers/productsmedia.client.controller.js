'use strict';

// Products controller
angular.module('products').controller('ProductsMediaController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$modal', 'Posts', 'ProductsServices', 'FileUploader',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $modal, Posts, ProductsServices, FileUploader) {

    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    console.log('productsmedia.client.controller - load ProductsMediaController');


    // Remove existing Products
    $scope.remove = function (product) {
      if (product) {
        product.$remove();

        for (var i in $scope.products) {
          if ($scope.products[i] === product) {
            $scope.products.splice(i, 1);
          }
        }
      } else {
        $scope.product.$remove(function () {
          $location.path('products');
        });
      }
    };

    // Update existing Product
    $scope.update = function (isValid) {
      console.log('products.client.controller - update - start');
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'productForm');

        return false;
      }

      var product = $scope.product;

      product.$update(function () {
        $location.path('products/' + product._id + '/edit');
        $scope.success = 'Successfully changed data';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      console.log('products.client.controller - update - end');
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

    // ************************************
    // **                                **
    // **           Open Image           **
    // **         cropper modal          **
    // **                                **
    // ************************************
    //
    $scope.modaladdImages = function (size, imageNo) {
      var templateURL = '';

      if (imageNo === 'main'){
        templateURL = 'modules/products/client/views/create-pictures.product.modal.view.html';
      } else if (imageNo === 'one') {
        templateURL = 'modules/products/client/views/create-pictures1.product.modal.view.html';
      } else {
        templateURL = 'modules/products/client/views/create-pictures2.product.modal.view.html';
      }

      // OPEN MODAL
      $scope.modalInstance = $modal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: templateURL,
        controller: function ($scope, $modalInstance) {
        },
        size: size
        /*resolve: {
          item: function () {
          return fileItem;
          }
        }*/
      });
    };


    // ************************************
    // **                                **
    // **             Image              **
    // **            cropper             **
    // **                                **
    // ************************************
    //

    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    /*$scope.uploader = new FileUploader({
      url: $scope.uploadUrl,
      removeAfterUpload: true,
      onBeforeUploadItem: function (item) {
        var stuff = {
          profiles: [1426, 1427, 1428],
          profiles_groups: '',
          upload_type: 'BROWSER',
          username: $scope.username,
          file_name: $scope.uploader.queue[0].file.name,
          file_size: $scope.uploader.queue[0].file.size,
          file_type: $scope.uploader.queue[0].file.type,
          file_created_date: 135479928,
        }
        item.formData.push(stuff);
      },
      onSuccessItem: function (item, response, status, headers) {

      },
      queueLimit: 1,
    });*/

    // Create file uploader instance
    var uploader = $scope.uploader = new FileUploader({
      url: 'api/users/productpicture',
      alias: 'productImageMainUpload',
      onSuccessItem: function (item, response, status, headers) {
        $scope.successpicture = false;
        console.log('products.client.controller - image uploader - onSuccessItem');

        if($scope.product)
        {
          $scope.product.productMainImageURL = response;
        } else {
          $scope.productMainImageURL = response;
        }



        console.log('products.client.controller - image uploader - ImageURL: ' +$scope.productMainImageURL);

        // Show success message
        $scope.successpicture = true;

        //$location.path('products/' + product._id + '/edit');

      },

      // fileFormDataName
      onCompleteItem: function (item, response, status, headers) {
        $scope.successpicture = false;
        console.log('products.client.controller - image uploader - onCompleteItem');


        $scope.productMainImageURL = response;

        console.log('products.client.controller - image uploader - ImageURL: ' +$scope.productMainImageURL);

        // Show success message
        $scope.successpicture = true;

        //$location.path('products/' + product._id + '/edit');

      }
      // fileFormDataName
    });

    console.log('New instance FileUploader!');

    // Set file uploader image filter
    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    uploader.onAfterAddingFile = function (fileItem) {
      console.log('products.client.controller - image uploader - onAfterAddingFile start ');
      $scope.successpicture = false;
      $scope.file = fileItem;

      if ($window.FileReader) {

        var fileExtension = '.' + fileItem.file.name.split('.').pop();
        fileItem.file.name = 'SuperHeroFile' + fileExtension;
        //Math.random().toString(36).substring(7) + new Date().getTime()

        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }

      console.log('products.client.controller - image uploader - onAfterAddingFile end ');

      //console.log('products.client.controller - image uploader - Start uploadProductMainPicture');
      //fileItem.upload();
      //console.log('products.client.controller - image uploader - End uploadProductMainPicture');
    };


    // Called after the user has failed to uploaded a new picture
    uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.errorpicture = response.message;
    };

    // ******* Main Function being called to save picture
    // Change user profile picture
    $scope.uploadProductMainPicture = function (fileItem) {
      console.log('products.client.controller - image uploader - Start uploadProductMainPicture');
      fileItem.upload();
      console.log('products.client.controller - image uploader - End uploadProductMainPicture');
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);
