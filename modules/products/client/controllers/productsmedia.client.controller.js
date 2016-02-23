'use strict';

// Products controller
angular.module('products').controller('ProductsMediaController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$uibModal', 'Posts', 'ProductsServices', 'FileUploader',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $uibModal, Posts, ProductsServices, FileUploader) {

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
      $scope.modalInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: templateURL,
        controller: function ($scope) {
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

      },



      onCompleteItem: function (item, response, status, headers) {


        $scope.successpicture = false;
        console.log('products.client.controller - image uploader - onCompleteItem - start');

        // Update product Main ImageURLs
        var product = $scope.product;

        if ($scope.insertFurtherImage1 === true){
          if(item.name === 'main')
            product.productFurtherImage1URL = response;
          if(item.name === 'facebook') {
            product.productFurtherImage1URLFacebook = response;
            product.productFurtherImage1URLCode = response;
          }
          if(item.name === 'pinterest') {
            product.productFurtherImage1URLPinterest = response;
          }

          product.productFurtherImage1Alt = $scope.productMainImageAlt;
        }
        else if ($scope.insertFurtherImage2 === true) {
          if(item.name === 'main')
            product.productFurtherImage2URL = response;
          if(item.name === 'facebook') {
            product.productFurtherImage2URLFacebook = response;
            product.productFurtherImage2URLCode = response;
          }
          if(item.name === 'pinterest') {
            product.productFurtherImage2URLPinterest = response;
          }

          product.productFurtherImage2Alt = $scope.productMainImageAlt;
        }
        else {
          if(item.name === 'main')
            product.productMainImageURL = response;
          if(item.name === 'facebook') {
            product.productMainImageURLFacebook = response;
            product.productMainImageURLCode = response;
          }
          if(item.name === 'pinterest') {
            product.productMainImageURLPinterest = response;
          }

          product.productMainImageAlt = $scope.productMainImageAlt;
        }

        $scope.productMainImageURL = response;

        // Update path in MM DB
        product.$update(function () {
          $scope.success = 'Successfully changed product media data';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        console.log('products.client.controller - image uploader - onCompleteItem - update - end');


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

        console.log('products.client.controller - image uploader - onCompleteItem - end');

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


      if ($window.FileReader) {

        var fileExtension = '.' + fileItem.file.name.split('.').pop();
        var index = uploader.getIndexOfItem(fileItem);

        fileItem.name = fileItem.file.name + ' (' + index + ')';
        fileItem.size = fileItem.file.size;

        $scope.file = fileItem;

        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }

      console.log('products.client.controller - image uploader - onAfterAddingFile end ');
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
    $scope.uploadProductMainPicture = function (fileItemfacebook,fileItempinterest) {

      console.log('products.client.controller - image uploader - Start uploadProductMainPicture');

      // Set scope for kind of Image
      $scope.uploadMainImage = true;

      uploader.queueLimit = 5;

      // Create blob from cropped file - FACEBOOK
      var blobfacebook = dataURItoBlob(fileItemfacebook.toDataURL());
      var itemfacebook = new FileUploader.FileItem(uploader, $scope.file);
      itemfacebook._file = blobfacebook;
      itemfacebook.name = 'facebook';
      itemfacebook.type = 'image/jpeg';
      uploader.queue.push(itemfacebook);


      // Create blob from cropped file - PINTEREST
      var blobpinterest = dataURItoBlob(fileItempinterest.toDataURL());
      var itempinterest = new FileUploader.FileItem($scope.uploader, $scope.file);
      itempinterest._file = blobpinterest;
      itempinterest.name = 'pinterest';
      itempinterest.type = 'image/jpeg';
      uploader.queue.push(itempinterest);


      // Upload all files in queue
      uploader.uploadAll();

      console.log('products.client.controller - image uploader - End uploadProductMainPicture');
    };

    /**
     * Converts data uri to Blob. Necessary for uploading.
     * @see
     *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     * @param  {String} dataURI
     * @return {Blob}
     */
    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
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
      $scope.selectImage = true;
    };

    $scope.showFurtherImage1Function = function () {
      $scope.showMainImage = false;
      $scope.insertFurtherImage1 = true;
      $scope.insertFurtherImage2 = false;
      $scope.selectImage = true;
    };

    $scope.showFurtherImage2Function = function () {
      $scope.showMainImage = false;
      $scope.insertFurtherImage2 = true;
      $scope.insertFurtherImage1 = false;
      $scope.selectImage = true;
    };



  }
]);
