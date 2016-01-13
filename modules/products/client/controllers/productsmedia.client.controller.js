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

    // Create file uploader instance
    var uploader = $scope.uploader = new FileUploader({
      url: 'api/users/productpicture',
      alias: 'productImageMainUpload',
      lastModifiedDate: new Date(),
      type: 'image/jpeg',
      name: 'logo.jpg',
      onSuccessItem: function (item, response, status, headers) {
        $scope.successpicture = false;
        console.log('products.client.controller - image uploader - onSuccessItem');

        /*if($scope.product)
        {
          $scope.product.productMainImageURL = response;
        } else {
          $scope.productMainImageURL = response;
        }

        console.log('products.client.controller - image uploader - ImageURL: ' +$scope.productMainImageURL);*/

        // Update product Main ImageURL
        var product = $scope.product;

        if ($scope.insertFurtherImage1 === true){
          product.productFurtherImage1URL = response;
          product.productFurtherImage1URLFacebook = response;
          product.productFurtherImage1URLPinterest = response;
          product.productFurtherImage1URLCode = response;
          product.productFurtherImage1Alt = $scope.productMainImageAlt;
        }
        else if ($scope.insertFurtherImage2 === true) {
          product.productFurtherImage2URL = response;
          product.productFurtherImage2URLFacebook = response;
          product.productFurtherImage2URLPinterest = response;
          product.productFurtherImage2URLCode = response;
          product.productFurtherImage2Alt = $scope.productMainImageAlt;
        }
        else {
          product.productMainImageURL = response;
          product.productMainImageURLFacebook = response;
          product.productMainImageURLPinterest = response;
          product.productMainImageURLCode = response;
          product.productMainImageAlt = $scope.productMainImageAlt;
        }

        product.$update(function () {
          $scope.success = 'Successfully changed product media data';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        console.log('products.client.controller - update - end');


        if ($scope.insertFurtherImage1 === true){
          $scope.successpicturemsg = 'Further product image 1 uploaded successfully.';
        }
        else if ($scope.insertFurtherImage2 === true) {
          $scope.successpicturemsg = 'Further product image 2 uploaded successfully.';
        }
        else {
          $scope.successpicturemsg = 'Main product image uploaded successfully.';
        }

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
        fileItem.file.name = fileItem.file.name;
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
    //
    $scope.uploadProductMainPicture = function (fileItem) {
      console.log('products.client.controller - image uploader - Start uploadProductMainPicture');

      // Set scope for kind of Image
      $scope.uploadMainImage = true;

      fileItem.upload();

      console.log('products.client.controller - image uploader - End uploadProductMainPicture');
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };

    $scope.showMainImageFunction = function () {
      $scope.showMainImage = true;
      $scope.insertFurtherImage1 = false;
      $scope.insertFurtherImage2 = false;
    };

    $scope.showFurtherImage1Function = function () {
      $scope.showMainImage = true;
      $scope.insertFurtherImage1 = true;
      $scope.insertFurtherImage2 = false;
    };

    $scope.showFurtherImage2Function = function () {
      $scope.showMainImage = true;
      $scope.insertFurtherImage2 = true;
      $scope.insertFurtherImage1 = false;
    };
  }
]);
