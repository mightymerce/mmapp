'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$modal', 'Posts', 'ProductsServices', 'FileUploader',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $modal, Posts, ProductsServices, FileUploader) {

    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    console.log('productsmedia.client.controller - load ProductsMediaController');

    // Create new Product
    $scope.create = function (isValid) {
      $scope.error = null;

      console.log('Start create product!');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'productForm');
        console.log('Error!');

        return false;
      }

      // Create new Product object
      var product = new Products({

        productId: this.productId,
        productTitle: this.productTitle,
        productDescription: this.productDescription,
        productPrice: this.productPrice,
        productTax: this.productTax,
        productCurrency: this.productCurrency,
        productSaleprice: this.productSaleprice,
        productSalepricefrom: this.productSalepricefrom,
        productSalepriceuntil: this.productSalepriceuntil,
        productShippingoption: this.productShippingoption,
        productItemInStock: this.productItemInStock,
        productMainImageURL: this.productMainImageURL,
        productMainImageURLFacebook: this.productMainImageURLFacebook,
        productMainImageURLTwitter: this.productMainImageURLTwitter,
        productMainImageURLPinterest: this.productMainImageURLPinterest,
        productMainImageURLEtsy: this.productMainImageURLEtsy,
        productMainImageURLDawanda: this.productMainImageURLDawanda,
        productMainImageURLCode: this.productMainImageURLCode,
        productMainImageAlt: this.productMainImageAlt,
        productFurtherImage1URL: this.productFurtherImage1URL,
        productFurtherImage1URLFacebook: this.productFurtherImage1URLFacebook,
        productFurtherImage1URLTwitter: this.productFurtherImage1URLTwitter,
        productFurtherImage1URLPinterest: this.productFurtherImage1URLPinterest,
        productFurtherImage1URLEtsy: this.productFurtherImage1URLEtsy,
        productFurtherImage1URLDawanda: this.productFurtherImage1URLDawanda,
        productFurtherImage1URLCode: this.productFurtherImage1URLCode,
        productFurtherImage1Alt: this.productFurtherImage1Alt,
        productFurtherImage2URL: this.productFurtherImage2URL,
        productFurtherImage2URLFacebook: this.productFurtherImage2URLFacebook,
        productFurtherImage2URLTwitter: this.productFurtherImage2URLTwitter,
        productFurtherImage2URLPinterest: this.productFurtherImage2URLPinterest,
        productFurtherImage2URLEtsy: this.productFurtherImage2URLEtsy,
        productFurtherImage2URLDawanda: this.productFurtherImage2URLDawanda,
        productFurtherImage2URLCode: this.productFurtherImage2URLCode,
        productFurtherImage2Alt: this.productFurtherImage2Alt,
        productFurtherImage3URL: this.productFurtherImage3URL,
        productFurtherImage3URLFacebook: this.productFurtherImage3URLFacebook,
        productFurtherImage3URLTwitter: this.productFurtherImage3URLTwitter,
        productFurtherImage3URLPinterest: this.productFurtherImage3URLPinterest,
        productFurtherImage3URLEtsy: this.productFurtherImage3URLEtsy,
        productFurtherImage3URLDawanda: this.productFurtherImage3URLDawanda,
        productFurtherImage3URLCode: this.productFurtherImage3URLCode,
        productFurtherImage3Alt: this.productFurtherImage3Alt,
        productFurtherImage4URL: this.productFurtherImage4URL,
        productFurtherImage4URLFacebook: this.productFurtherImage4URLFacebook,
        productFurtherImage4URLTwitter: this.productFurtherImage4URLTwitter,
        productFurtherImage4URLPinterest: this.productFurtherImage4URLPinterest,
        productFurtherImage4URLEtsy: this.productFurtherImage4URLEtsy,
        productFurtherImage4URLDawanda: this.productFurtherImage4URLDawanda,
        productFurtherImage4URLCode: this.productFurtherImage4URLCode,
        productFurtherImage4Alt: this.productFurtherImage4Alt,
        productFurtherImage5URL: this.productFurtherImage5URL,
        productFurtherImage5URLFacebook: this.productFurtherImage5URLFacebook,
        productFurtherImage5URLTwitter: this.productFurtherImage5URLTwitter,
        productFurtherImage5URLPinterest: this.productFurtherImage5URLPinterest,
        productFurtherImage5URLEtsy: this.productFurtherImage5URLEtsy,
        productFurtherImage5URLDawanda: this.productFurtherImage5URLDawanda,
        productFurtherImage5URLCode: this.productFurtherImage5URLCode,
        productFurtherImage5Alt: this.productFurtherImage5Alt
      });

      // Redirect after save
      product.$save(function (response) {
        $location.path('products/' + response._id + '/editmedia');

        // Clear messages
        $scope.success = $scope.error = null;

        // Clear form fields
        $scope.productDescription = '';
        $scope.productPrice = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

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
