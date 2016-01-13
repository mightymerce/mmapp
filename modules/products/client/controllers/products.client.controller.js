'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$modal', 'Posts', 'ProductsServices', 'Taxes', 'Currencys', 'Deliverys',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $modal, Posts, ProductsServices, Taxes, Currencys, Deliverys) {

    $scope.authentication = Authentication;

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

        var FB = $window.FB;
        if(FB) {
          console.log('products.client.controller - modalupdateProductPost - call getLoginStatus()');
          FB.getLoginStatus(function (response) {
            console.log('products.client.controller - modalupdateProductPost - call getLoginStatus() - response: ' +response.status);
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
              console.log('products.client.controller - modalupdateProductPost - Not authorized');
              $scope.error = 'The user you are currently logged in to facebook is not authorized for Mightymerce. Please switch to your authorized user or log off from facebook and click again on "Create Post" to authorize your current facebook user.';

            }
            else {
              // Note: The call will only work if you accept the permission request
              console.log('products.client.controller - modalupdateProductPost - call login Facebook');
              ProductsServices.loginFacebook();
              // TODO - work with promise to show error message
              // $scope.error = 'You are now connected to facebook! Please click on "Create Post again"!';
              $scope.varFBConnected = true;
              $scope.success = 'You are now connected to facebook! Please click on "Create Post again"!';
            }

          });
        } else {
          console.log('products.client.controller - modalupdateProductPost - Facebook is not init');
        }


      }

      if (postChannel === 'Pinterest') {
        // Pinterest connect

        console.log('products.client.controller - modalupdateProductPost - start');
        var loginResponse = ''; // ProductsServices.getPinterestLogin();

        if (loginResponse === 'cancel') {
          $scope.success = 'You did not grant access to your Pinterest board. Please try again to post products to your Pinterest board.';
        } else {
          // get access token
          $scope.pinAccessToken = loginResponse;
          console.log('products.client.controller - modalupdateProductPost - Pinterest user access token: ' +loginResponse);

          // get welcome message
          var meResponse = ProductsServices.getPinterestMe();

          if (meResponse === 'error') {
            $scope.error = 'Oops, there was a problem getting your information';
          } else {
            $scope.success = meResponse;
          }

          // session has been set
          // OPEN MODAL
          console.log('');
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
    };

    $scope.productCurrency = Currencys.query({
      'user': $scope.authentication.user._id
    });

    $scope.productTax = Taxes.query({
      'user': $scope.authentication.user._id
    });

    $scope.productShippingoption = Deliverys.query({
      'user': $scope.authentication.user._id
    });

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

      console.log('products.client.controller - update - product.productId: ' +product.productId);

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

      ProductsServices.getPosts($scope.authentication.user._id,$stateParams.productId).then(function (Posts) {
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
        console.log('products.client.controller - findone() - varFacebookPosts: ' +varFacebookPosts);

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

    /*

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

*/

    // ************************************
    // **                                **
    // **        POST to FACEBOOK        **
    // **                                **
    // ************************************
    //
    $scope.postPost = function (isValid) {

      console.log('product.client.controller - Start posting to Facebook');
      ProductsServices.postToWall($scope.product).then(function(promise) {
        $scope.success = promise;
      });

      // Close modal
      //$scope.modalInstance.close();

    };


    // ************************************
    // **                                **
    // **        POST to PINTEREST       **
    // **                                **
    // ************************************
    //
    $scope.postPostPinterest = function (isValid) {

      console.log('products.client.controller - postPostPinterest - Start');
      ProductsServices.postToPinterest($scope.product).then(function(promise) {
        $scope.success = promise;
      });
    };



    // Close Modal
    $scope.cancelModal = function () {
      $scope.modalInstance.$dismiss();
    };
  }
]);
