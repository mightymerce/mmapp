'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$modal', 'Posts', 'ProductsServices', 'FileUploader',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $modal, Posts, ProductsServices, FileUploader) {

    $scope.authentication = Authentication;
    var FB = $window.FB;
    var PDK = $window.PDK;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    console.log('products.client.controller - load ProductsController');

    $scope.modalupdateProductPost = function (size, selectedProduct, postChannel, postStatus, postPublicationDate) {

      console.log('products.client.controller - start open modal - ModalUpateProductPost');
      if (postChannel === 'Facebook') {
        // Facebook connect
        var FBConnectStatus = '';
        $scope.varFBConnected = false;
        console.log('products.client.controller - modalupdateProductPost - Facebook connected: ' + $scope.varFBConnected);


        FB.getLoginStatus(function(response){
          if (response.status === 'connected') {
            // Logged into your app and Facebook.
            $scope.varFBConnected = true;

            console.log('products.client.controller - modalupdateProductPost - Facebook connected open modal');

            // OPEN MODAL
            $scope.modalInstance = $modal.open({
              //animation: $scope.animationsEnabled,
              templateUrl: 'modules/products/client/views/post.product.modal.view.html',
              controller: function ($scope, $modalInstance, product) {
                $scope.product = product;
                $scope.varPostStatus = postStatus;
                $scope.varPostPublicationDate = postPublicationDate;
                $scope.varPostChannel = postChannel;
              },
              size: size,
              resolve: {
                product: function () {
                  return selectedProduct;
                }
              }
            });
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

          } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            // TODO Error message that user has not the necessary authorization given
            $scope.error = 'The user you are currently logged in to facebook is not authorized for Mightymerce. Please switch to your authorized user or log off from facebook and click again on "Create Post" to authorize your current facebook user.';

          }
          else {
            // Note: The call will only work if you accept the permission request
            ProductsServices.loginFacebook();
            // TODO - work with promise to show error message
            // $scope.error = 'You are now connected to facebook! Please click on "Create Post again"!';
            $scope.varFBConnected = true;
            $scope.errorsuccess = 'You are now connected to facebook! Please click on "Create Post again"!';
          }
        });


      }

      if (postChannel === 'Pinterest') {
        // Pinterest connect
        //$scope.varFBConnected = false;
        var session = ProductsServices.getPinterestSession();
        if (!session) {
          alert('No session has been set.');
          $scope.error = ProductsServices.getPinterestLogin();
        } else {
          // save session to server
          var response = ProductsServices.setPinterestSession();
          if (!response || !response.session) {
            $scope.error = 'Session was not set. Did you provide a valid session?';
          } else {
            // session has been set
            // OPEN MODAL
            $scope.modalInstance = $modal.open({
              //animation: $scope.animationsEnabled,
              templateUrl: 'modules/products/client/views/post.product.modal.view.html',
              controller: function ($scope, $modalInstance, product) {
                $scope.product = product;
                $scope.varPostStatus = postStatus;
                $scope.varPostPublicationDate = postPublicationDate;
                $scope.varPostChannel = postChannel;
              },
              size: size,
              resolve: {
                product: function () {
                  return selectedProduct;
                }
              }
            });
          }
        }
      }
    };

    $scope.productTax = {
      repeatSelect: null,
      availableOptions: [
        { id: '1', name: '19%' },
        { id: '2', name: '10%' },
        { id: '3', name: '7%' }
      ]
    };

    $scope.productCurrency = {
      repeatSelect: null,
      availableOptions: [
        { id: '1', name: 'EUR' },
        { id: '2', name: 'USD' },
        { id: '3', name: 'CHF' }
      ]
    };

    $scope.productShippingoption = {
      repeatSelect: null,
      availableOptions: [
        { id: '1', name: 'Standard Delivery. 2-3 business days' },
        { id: '2', name: '' }
      ]
    };


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
        $scope.productId = response._id;
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
        $scope.success = 'You successfully updated your product data.';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      console.log('products.client.controller - update - end');
    };

    // Find a list of Products
    $scope.find = function () {
      $scope.products = Products.query({
        'user': $scope.authentication.user._id
      });
    };

    // Find a list of Products
    $scope.findWithPost = function () {
      $scope.products = Products.query({
        'user': $scope.authentication.user._id
      });
    };

    // Find existing Products
    $scope.findOne = function () {
      $scope.product = Products.get({
        productId: $stateParams.productId
      });

      $scope.productSelectId = $stateParams.productId;

      /*
      ProductsServices.getPosts($stateParams.productId).then(function (Posts) {
        $scope.posts = Posts;
      });
      */

      $scope.facebookPostsAvailable = false;
      $scope.pinterestPostsAvailable = false;
      $scope.codeSnippetPostsAvailable = false;

      var varFacebookPosts = 0;
      var varPinterestPosts = 0;
      var varCodeSnippetPosts = 0;

      ProductsServices.getPosts($stateParams.productId).then(function (Posts) {
        $scope.posts = Posts;
        for (var i in Posts) {
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Facebook') {
            varFacebookPosts += 1;
            $scope.facebookPostsAvailable = true;
          }
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Pinterest') {
            varFacebookPosts += 1;
            $scope.pinterestPostsAvailable = true;
          }
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'CodeSnippet') {
            varCodeSnippetPosts += 1;
            $scope.codeSnippetPostsAvailable = true;
          }
        }
        console.log('varFacebookPosts: ' +varFacebookPosts);

        $scope.facebookPostsNo = varFacebookPosts;
        $scope.pinterestPostsNo = varPinterestPosts;
        $scope.codeSnippetPostsNo = varCodeSnippetPosts;
      });

    };


    // ************************************
    // **                                **
    // **          Pinterest             **
    // **            modal               **
    // **                                **
    // ************************************
    //
    //
    $scope.modaleditPinterestProduct = function (size, selectedProduct) {

      // OPEN MODAL
      $scope.modalInstance = $modal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/products/client/views/edit-pinterest.product.modal.view.html',
        controller: function ($scope, $modalInstance, Products) {
          ProductsServices.getProducts().then(function (Products) {
            $scope.products = Products;
          });
        },
        size: size,
        resolve: {
          product: function () {
            return selectedProduct;
          }
        }
      });

    };

    // ************************************
    // **                                **
    // **          Facebook              **
    // **            modal               **
    // **                                **
    // ************************************
    //
    //
    $scope.modaleditFacebookProduct = function (size, selectedProduct) {

      // OPEN MODAL
      $scope.modalInstance = $modal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/products/client/views/edit-facebook.product.modal.view.html',
        controller: function ($scope, $modalInstance, Products) {
          ProductsServices.getProducts().then(function (Products) {
            $scope.products = Products;
          });
        },
        size: size,
        resolve: {
          product: function () {
            return selectedProduct;
          }
        }
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


    $scope.loginFacebook = function (response) {

      // ************************************
      // **                                **
      // **      VERIFY USER connected     **
      // **           to FACEBOOK          **
      // **                                **
      // ************************************
      //
      //FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log('Logged in. Token: ' +response.authResponse.accessToken);
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
      }
      else {
        // Note: The call will only work if you accept the permission request
        // TODO use service instead call in controller
        ProductsServices.loginFacebook();
        $scope.varFBConnected = true;
      }
    };



    $scope.loginPinterest = function (isValid) {

      // ************************************
      // **                                **
      // **      VERIFY USER connected     **
      // **           to PINTEREST         **
      // **                                **
      // ************************************
      //
      var session = PDK.getSession();
      if (!session) {
        alert('No session has been set.');
        PDK.login({ scope : 'read_public, write_public' }, function(session) {
          if (!session) {
            alert('The user chose not to grant permissions or closed the pop-up');
          } else {
            console.log('Thanks for authenticating. Getting your information...');
            PDK.me(function(response) {
              if (!response || response.error) {
                alert('Oops, there was a problem getting your information');
              } else {
                console.log('Welcome,  ' + response.data.first_name + '!');
              }
            });
          }
        });
      } else {
        // save session to server
        PDK.setSession(session, function(response) {
          if (!response || !response.session) {
            alert('Session was not set. Did you provide a valid session?');
          } else {
            // session has been set
          }
        });
      }
    };


    // ************************************
    // **                                **
    // **        POST to FACEBOOK        **
    // **                                **
    // ************************************
    //
    $scope.postPost = function (isValid) {
      /*
      //FB.getMyLastName()
        .then(function(response) {
          console.log('Response Last.Name: ' +response.last_name);
        }
      );
      */

      console.log('product.client.controller - Start posting to Facebook');
      var postFacebookID = ProductsServices.postToWall($scope.product);

      var getPostFacebookID = function () {
        return ProductsServices.postToWall($scope.product)
          .then(function (response) {
            return function () {


              // Create new Post object
              var post = new Posts({
                product: $scope.product._id,
                channel: $scope.varPostChannel,
                postChannel: 'Facebook',
                postId: response.id,
                postStatus: 'Active',
                postPublicationDate: '',
                postExternalPostKey: response.id
              });

              // Save post to MM
              post.$save(function (response) {
                console.log('product.client.controller - save post on MM success!');
                // Redirect or not?
                $location.path('posts/' + response._id);
                // Close modal
                $scope.modalInstance.close();
              }, function (errorResponse) {
                console.log('product.client.controller - save post on MM error: ' +errorResponse);
                $scope.error = errorResponse.data.message;
              });


            };
          });
      };
      $scope.error = 'Success posting to Facebook!';
      // Redirect or not?
      //$location.path('posts/' + response._id);
    };

    /*
    // ************************************
    // **                                **
    // **        POST to PINTEREST       **
    // **                                **
    // ************************************
    //
    $scope.postPostPinterest = function (isValid) {
      facebookService.getMyLastName()
       .then(function(response) {
       console.log('Response Last.Name: ' +response.last_name);
       }
       );*!/

      console.log('Start posting Post Pinterest');
      var postFacebookID = ProductsServices.postToPinterest($scope.product);

      console.log('Save Post on MM success!');
      // Redirect or not?
      // $location.path('posts/' + response._id);

      $scope.error = 'Success posting to Facebook!';
    };

    */

    // Close Modal
    $scope.cancelModal = function () {
      $scope.modalInstance.$dismiss();
    };
  }
]);
