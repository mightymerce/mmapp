'use strict';

// Products controller
angular.module('products').controller('ProductsMediaController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$uibModal', 'Posts', 'ProductsServices', 'FileUploader',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $uibModal, Posts, ProductsServices, FileUploader) {

    $scope.authentication = Authentication;
    $scope.imagesMaintained = false;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    console.log('productsmedia.client.controller - load ProductsMediaController');

    if (!$scope.loaded) {
      // Load page after Instagram callback
      if($location.search().instco === 'success'){
        console.log('product.client.controller - load page after callback Instagram - start');

        console.log('productsmedia.client.controller - modalupdateProductPost - Retrieve media');
        ProductsServices.instagramGetMedia($scope.authentication.user.instagramAccessToken).then(function(productimages) {
          console.log('productsmedia.client.controller - modalupdateProductPost - Retrieve media success: ' +productimages);
          $scope.productimages = productimages;

          for(var i = 0; i < productimages.length; i++) {
            var data= productimages[i];

            console.log(data.id);
          }

          if (productimages){
            $scope.modalInstance = $uibModal.open({
              //animation: $scope.animationsEnabled,
              templateUrl: 'modules/products/client/views/media-instagram.product.modal.view.html',
              controller: function ($scope, product) {
                $scope.productimages = productimages;
                $scope.loaded = true;
              },
              size: 'md',
              resolve: {
                product: function () {
                  return '';
                }
              }
            });

          } else {
            $scope.error = 'Error loading your Instagram medias. Please try again.';
          }
        });
      } else if ($location.search().instco === 'error') {
        $scope.error = 'You did not grant mightymerce access to your Instagram account yet. Please try again.';
        console.log('productsmedia.client.controller - load page after callback Instagram - error');
      }
    }

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

      $scope.imagesMaintained = false;

      Products.get({
        productId: $stateParams.productId
      }, function(products) {

        $scope.product = products;

        if($scope.product.productMainImageURL === '') {
          $scope.product.productMainImageURL = '../../../../modules/products/client/img/photo_not_available.png';
          $scope.product.productMainImageURLFacebook = '../../../../modules/products/client/img/photo_not_available.png';
          $scope.product.productMainImageURLPinterest = '../../../../modules/products/client/img/photo_not_available.png';
          $scope.product.productMainImageURLTwitter = '../../../../modules/products/client/img/photo_not_available.png';
          $scope.product.productMainImageURLCode = '../../../../modules/products/client/img/photo_not_available.png';
          $scope.imagesMaintained = false;
        } else if ($scope.product.productMainImageURL !== '' && $scope.product.productMainImageURL !== '../../../../modules/products/client/img/photo_not_available.png') {
          $scope.imagesMaintained = true;
        }
      });

      ProductsServices.getPosts($stateParams.productId).then(function (Posts) {
        $scope.posts = Posts;
      });
      
      $scope.selectImage = true;
      $scope.errorpicture = 'Bitte lade zunächst in Schritt 1 ein Bild hoch, um es dann zuschneiden und abspeichern zu können.';
    };

    // ************************************
    // **                                **
    // **           Get Image            **
    // **        from Instagram          **
    // **                                **
    // ************************************
    //
    $scope.modalupdateProductPost = function (size, selectedProduct, postChannel, postStatus, postPublicationDate) {

      console.log('productsmedia.client.controller - start open modal - ModalUpateProductPost');
      if (postChannel === 'Instagram') {
        if ((!$scope.authentication.user.instagramAccessToken) || ($scope.authentication.user.instagramAccessToken === ''))
        {
          // Instagram get authentication connect
          console.log('productsmedia.client.controller - modalupdateProductPost - Instagram - Start');
          var callback_url = '';

          if ($location.host() === 'localhost'){
            callback_url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/products?this=' + $scope.product._id;
          } else {
            callback_url = $location.protocol() + '://' + $location.host() + '/products?this=' + $scope.product._id;
          }
          console.log('products.client.controller - modalupdateProductPost - Instagram - callback_url: ' + callback_url);
          window.open('https://api.instagram.com/oauth/authorize/?client_id=15005e14881a44b7a3021a6e63ca3e04&redirect_uri=' + callback_url + '&response_type=code&scope=likes+comments', "_self");

        }
        else
        {
          console.log('productsmedia.client.controller - modalupdateProductPost - Instagram - Start - credentials set');

          console.log('productsmedia.client.controller - modalupdateProductPost - Retrieve media');
          ProductsServices.instagramGetMedia($scope.authentication.user.instagramAccessToken).then(function(productimages) {
            console.log('productsmedia.client.controller - modalupdateProductPost - Retrieve media success: ' +productimages);
            $scope.productimages = productimages;

            for(var i = 0; i < productimages.length; i++) {
              var data= productimages[i];

              console.log(data.id);
            }

            if (productimages){
              $scope.modalInstance = $uibModal.open({
                //animation: $scope.animationsEnabled,
                templateUrl: 'modules/products/client/views/media-instagram.product.modal.view.html',
                controller: function ($scope, product) {
                  $scope.productimages = productimages;
                  $scope.varPostStatus = postStatus;
                  $scope.varPostPublicationDate = postPublicationDate;
                  $scope.varPostChannel = postChannel;
                },
                size: 'md',
                resolve: {
                  product: function () {
                    return selectedProduct;
                  }
                }
              });

            } else {
              $scope.error = 'Error loading your Instagram medias. Please try again.';
            }
          });
        }
      }

    };


    $scope.saveInstagramMedia = function (instagramImageId, instagramImagesLow_resolutionUrl, instagramImagesStandard_resolutionUrl, instagramImagesThumbnailUrl) {
      console.log('productsmedia.client.controller - saveInstagramMedia - Instagram - Start');

      var product = new Products($scope.product);

      product.instagramImageId = instagramImageId;
      product.instagramImagesLow_resolutionUrl = instagramImagesLow_resolutionUrl;
      product.instagramImagesStandard_resolutionUrl = instagramImagesStandard_resolutionUrl;
      product.instagramImagesThumbnailUrl = instagramImagesThumbnailUrl;

      $scope.product.instagramImagesThumbnailUrl = instagramImagesThumbnailUrl;


      // Update path in MM DB
      product.$update(function () {
        $scope.success = 'Successfully added Instagram media data';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      console.log('products.client.controller - saveInstagramMedia - Instagram - update - End');


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


        $scope.errorpicture = false;
        console.log('products.client.controller - image uploader - onCompleteItem - start');

        // Update product Main ImageURLs
        var product = $scope.product;

        if ($scope.insertFurtherImage1 === true){
          if(item.name.substring(0,4) === 'crop') {
            $scope.product.productFurtherImage1URL = response;
            product.productFurtherImage1URL = response;
          }
          if(item.name === 'facebook') {
            $scope.product.productFurtherImage1URLFacebook = response;
            $scope.product.productFurtherImage1URLCode = response;
            product.productFurtherImage1URLFacebook = response;
            product.productFurtherImage1URLCode = response;
          }
          if(item.name === 'twitter') {
            $scope.product.productFurtherImage1URLTwitter = response;
            product.productFurtherImage1URLTwitter = response;
          }
          if(item.name === 'pinterest') {
            $scope.product.productFurtherImage1URLPinterest = response;
            product.productFurtherImage1URLPinterest = response;
          }


          product.productFurtherImage1Alt = $scope.productMainImageAlt;
        }
        else if ($scope.insertFurtherImage2 === true) {
          if(item.name.substring(0,4) === 'crop')
            $scope.product.productFurtherImage2URL = response;
            product.productFurtherImage2URL = response;
          if(item.name === 'facebook') {
            $scope.product.productFurtherImage2URLFacebook = response;
            $scope.product.productFurtherImage2URLCode = response;
            product.productFurtherImage2URLFacebook = response;
            product.productFurtherImage2URLCode = response;
          }
          if(item.name === 'pinterest') {
            $scope.product.productFurtherImage2URLPinterest = response;
            product.productFurtherImage2URLPinterest = response;
          }
          if(item.name === 'twitter') {
            $scope.product.productFurtherImage2URLTwitter = response;
            product.productFurtherImage2URLTwitter = response;
          }

          product.productFurtherImage2Alt = $scope.productMainImageAlt;
        }
        else {
          if(item.name.substring(0,4) === 'crop') {
            $scope.product.productMainImageURL = response;
            product.productMainImageURL = response;
          }
          if(item.name === 'facebook') {
            $scope.product.productMainImageURLFacebook = response;
            $scope.product.productMainImageURLCode = response;
            product.productMainImageURLFacebook = response;
            product.productMainImageURLCode = response;
          }
          if(item.name === 'twitter') {
            $scope.product.productMainImageURLTwitter = response;
            product.productMainImageURLTwitter = response;
            $timeout(callAtTimeout(product), 1000);
          }
          if(item.name === 'pinterest') {
            $scope.product.productMainImageURLPinterest = response;
            product.productMainImageURLPinterest = response;
            $timeout(callAtTimeout(product), 4000);
          }

          product.productMainImageAlt = $scope.productMainImageAlt;
        }

        // $scope.productMainImageURL = response;


      }
    });

    // Update path in MM DB
    function callAtTimeout(product) {
      product.$update(function (res) {
        $scope.success = 'Successfully changed product media data';
        if ($scope.insertFurtherImage1 === true){
          $scope.successpicturemsg = 'Further product image 1 uploaded successfully.';
        }
        else if ($scope.insertFurtherImage2 === true) {
          $scope.successpicturemsg = 'Further product image 2 uploaded successfully.';
        }
        else {
          $scope.successpicturemsg = 'Deine Bildausschnitte wurden gespeichert.';
        }

        // Show success message
        $scope.successpicture = true;

        console.log('products.client.controller - image uploader - onCompleteItem - update - end');

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      console.log('products.client.controller - image uploader - onCompleteItem - end');
    }





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
      $scope.errorpicture = '';


      if ($window.FileReader) {

        var fileExtension = '.' + fileItem.file.name.split('.').pop();
        var index = uploader.getIndexOfItem(fileItem);

        fileItem.name = 'crop-' + fileItem.file.name + ' (' + index + ')';
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
    $scope.uploadProductMainPicture = function (fileItemfacebook,fileItempinterest,fileItemtwitter) {

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

      // Create blob from cropped file - TWITTER
      var blobtwitter = dataURItoBlob(fileItemtwitter.toDataURL());
      var itemtwitter = new FileUploader.FileItem($scope.uploader, $scope.file);
      itemtwitter._file = blobtwitter;
      itemtwitter.name = 'twitter';
      itemtwitter.type = 'image/jpeg';
      uploader.queue.push(itemtwitter);


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
