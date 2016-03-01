'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$uibModal', 'Posts', 'ProductsServices', 'Taxes', 'Currencys', 'Deliverys', 'Users', 'GetDawanda',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $uibModal, Posts, ProductsServices, Taxes, Currencys, Deliverys, Users, GetDawanda) {

    $scope.authentication = Authentication;

    var PDK = $window.PDK;
    $scope.hideSpinner = true;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    // check if all tutorial fields are set
    if ($scope.authentication.user.tutorialCompanyDetail === '1' &&
        $scope.authentication.user.tutorialLegalDetail === '1' &&
        $scope.authentication.user.tutorialPaypalDetail === '1' &&
        $scope.authentication.user.tutorialDeliveryDetail === '1' &&
        $scope.authentication.user.tutorialProductDetail === '1') {
      // Load Tutorial
      $scope.basicData = true;
    } else {
      $scope.basicData = false;
    }


    if ((!$scope.authentication.user.twitterAccessToken && !$scope.authentication.user.twitterAccessTokenSecret) || ($scope.authentication.user.twitterAccessToken === '' && $scope.authentication.user.twitterAccessTokenSecret === '')) {
      // Load page after Twitter callback
      if ($location.search().oauth_verifier && $location.search().oauth_token) {

        // should return oauth_token & oauth_verifier
        var twitterOAuth_Verifier = $location.search().oauth_verifier;
        var twitterOAuth_Token = $location.search().oauth_token;

        var promiseOAuthVerifier = ProductsServices.twitterGetAccessToken(twitterOAuth_Verifier, twitterOAuth_Token);
        promiseOAuthVerifier.then(function (promise) {

          // store twitter user data for further requests
          var user = new Users($scope.user);
          user.twitterAccessToken = promise.oauth_token;
          user.twitterAccessTokenSecret = promise.oauth_token_secret;

          user.$update(function (response) {
            $scope.$broadcast('show-errors-reset', 'userForm');

            // Show user message if tokens stored successful
            $scope.success = 'Your twitter account verification was successful. Please click on - Create Post - again.';
            Authentication.user = response;

            console.log('product.client.controller - load page after callback Twitter - success');
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
            console.log('product.client.controller - load page after callback Twitter - error');
          });

        });
      }
    }

    // Load page after Twitter callback
    if($location.search().code){
      console.log('product.client.controller - load page after callback Instagram - start');
      // should return oauth_token & oauth_verifier
      var instagramCode = $location.search().code;
      console.log('product.client.controller - load page after callback Instagram - code: ' +instagramCode);

      var callback_url = '';

      if ($location.host() === 'localhost'){
        callback_url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/products?this=' + $location.search().this;
      } else {
        callback_url = $location.protocol() + '://' + $location.host() + '/products/?this=' + $location.search().this;
      }

      // get Instagram Access Token
      var promiseOAuthVerifier = ProductsServices.instagramGetAccessToken(instagramCode, $location.search().this);
      promiseOAuthVerifier.then(function(promise) {

        // todo store instagram user data for further requests
        var user = new Users($scope.user);
        user.instagramAccessToken = promise.access_token;

        user.$update(function (response) {
          $scope.$broadcast('show-errors-reset', 'userForm');

          // Show user message if tokens stored successful
          $scope.success = 'Your Instagram account verification was successful. Please click on - Create Post - again.';
          Authentication.user = response;

          console.log('product.client.controller - load page after callback Instagram - success');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
          console.log('product.client.controller - load page after callback Instagram - error update mm db');
        });

      });
    } else {
      if ($location.search().error)
      {
        $scope.error = 'You did not grant mightymerce access to your Instagram account yet.';
        console.log('product.client.controller - load page after callback Instagram - error');
      }
    }


    console.log('products.client.controller - load ProductsController');

    $scope.modalupdateProductPost = function (size, selectedProduct, postChannel, postStatus, postPublicationDate) {

      console.log('products.client.controller - start open modal - ModalUpateProductPost');
      if (postChannel === 'Facebook') {
        // Facebook connect
        var FBConnectStatus = '';
        $scope.varFBConnected = false;
        $scope.hideSpinner = false;


        var FB = $window.FB;
        if(FB) {
          console.log('products.client.controller - modalupdateProductPost - call getLoginStatus()');
          FB.getLoginStatus(function (response) {
            console.log('products.client.controller - modalupdateProductPost - call getLoginStatus() - response: ' +response.status);
            if (response.status === 'connected') {
              // Logged into your app and Facebook.
              $scope.varFBConnected = true;
              $scope.hideSpinner = true;

              console.log('products.client.controller - modalupdateProductPost - Facebook connected open modal');

              // OPEN MODAL
              $scope.modalInstance = $uibModal.open({
                //animation: $scope.animationsEnabled,
                templateUrl: 'modules/products/client/views/post.product.modal.view.html',
                controller: function ($scope, product) {
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
              $scope.hideSpinner = true;
              console.log('products.client.controller - modalupdateProductPost - Not authorized');
              $scope.error = 'The user you are currently logged in to facebook is not authorized for Mightymerce. Please switch to your authorized user or log off from facebook and click again on "Create Post" to authorize your current facebook user.';

            }
            else {
              // Note: The call will only work if you accept the permission request

              console.log('product.client.controller - Start posting to Facebook');
              ProductsServices.postToWall($scope.product).then(function(promise) {
                $scope.success = promise;
                $scope.hideSpinner = true;
              });


              console.log('products.client.controller - modalupdateProductPost - call login Facebook');
              ProductsServices.loginFacebook().then(function(promise) {

                $scope.varFBConnected = true;
                $scope.success = promise;
                // $scope.error = 'You are now connected to facebook! Please click on "Create Post again"!';

                console.log('products.client.controller - modalupdateProductPost - login Facebook done');

                // Do not show promise - as this is the token returned
              });
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
          $scope.modalInstance = $uibModal.open({
            //animation: $scope.animationsEnabled,
            templateUrl: 'modules/products/client/views/post.product.modal.view.html',
            controller: function ($scope, product) {
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

      if (postChannel === 'Etsy') {
        // Etsy connect
        console.log('products.client.controller - modalupdateProductPost - Start');

        ProductsServices.getEtsyOAuth().then(function(promise) {
          console.log('products.client.controller - modalupdateProductPost - getEtsyOAuth - return URL: ' +promise);
          window.open(promise);
        });
      }

      if (postChannel === 'Dawanda') {
        // Etsy connect
        console.log('products.client.controller - modalupdateProductPost - Start');

        //GetDawanda.query();
        ProductsServices.getDawandaOAuth().then(function(promise) {
          console.log('products.client.controller - modalupdateProductPost - getDawandaOAuth - return URL: ' +promise);
          //window.open(promise);
        });
      }

      if (postChannel === 'Twitter') {
        if ((!$scope.authentication.user.twitterAccessToken && !$scope.authentication.user.twitterAccessTokenSecret) || ($scope.authentication.user.twitterAccessToken === '' && $scope.authentication.user.twitterAccessTokenSecret === ''))
        {
          // Twitter connect
          console.log('products.client.controller - modalupdateProductPost - Twitter - Start');

          var promiseOAuth = ProductsServices.twitterGetOAuthToken($scope.product._id);
          promiseOAuth.then(function successCallback(response) {
            window.open('https://api.twitter.com/oauth/authenticate?oauth_token=' +response);
          });
        }
        else
        {
          console.log('products.client.controller - modalupdateProductPost - Twitter - twitterVerifyCredentials - AccessToken: ' +$scope.authentication.user.twitterAccessToken);

          //if the user is a returning user, hide the sign in button and display the tweets
          var promiseOAuth = ProductsServices.twitterVerifyCredentials($scope.authentication.user.twitterAccessToken, $scope.authentication.user.twitterAccessTokenSecret);
          promiseOAuth.then(function successCallback(response) {
            if (response === 'valid') {
              // user is valid Twitter User
              // OPEN MODAL
              $scope.modalInstance = $uibModal.open({
                //animation: $scope.animationsEnabled,
                templateUrl: 'modules/products/client/views/post.product.modal.view.html',
                controller: function ($scope, product) {
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

            else {
              // Twitter connect to get new credentials
              console.log('products.client.controller - modalupdateProductPost - Twitter - get new credentials');

              var promiseOAuth = ProductsServices.twitterGetOAuthToken($scope.product._id);
              promiseOAuth.then(function successCallback(response) {
                window.open('https://api.twitter.com/oauth/authorize?oauth_token=' +response);
              });
            }

          });
        }
      }

      if (postChannel === 'Instagram') {
        if ((!$scope.authentication.user.instagramAccessToken) || ($scope.authentication.user.instagramAccessToken === ''))
        {
          // Instagram get authentication connect
          console.log('products.client.controller - modalupdateProductPost - Instagram - Start');
          var callback_url = '';

          if ($location.host() === 'localhost'){
            callback_url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/products?this=' + $scope.product._id;
          } else {
            callback_url = $location.protocol() + '://' + $location.host() + '/products?this=' + $scope.product._id;
          }
          console.log('products.client.controller - modalupdateProductPost - Instagram - callback_url: ' + callback_url);
          window.open('https://api.instagram.com/oauth/authorize/?client_id=15005e14881a44b7a3021a6e63ca3e04&redirect_uri=' + callback_url + '&response_type=code&scope=likes+comments');

        }
        else
        {
          console.log('products.client.controller - modalupdateProductPost - Instagram - Start - credentials set');

          $scope.modalInstance = $uibModal.open({
            //animation: $scope.animationsEnabled,
            templateUrl: 'modules/products/client/views/post.product.modal.view.html',
            controller: function ($scope, product) {
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

      var linkUrl = $location.protocol() + '://' + $location.host();
      if($location.host() === 'localhost'){
        linkUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/';
      } else {
        linkUrl = $location.protocol() + '://' + $location.host() + '/checkouts/';
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
        productFurtherImage5Alt: this.productFurtherImage5Alt,
        productCheckoutURL: linkUrl
      });

      // Redirect after save
      product.$save(function (response) {
        // in case create update for tutorial
        if ($scope.authentication.user.tutorialProductDetail === '0') {
          var user = new Users($scope.user);
          user.tutorialProductDetail = '1';

          user.$update(function (response) {
            console.log('edit-profile.client.controller - updateUser - tutorial flag');
            $scope.authentication.user.tutorialProductDetail = '1';
            Authentication.user.tutorialProductDetail = '1';
          }, function (errorResponse) {
            console.log('edit-profile.client.controller - updateUser - tutorial flag error');
          });
        }
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
        console.log('products.client.controller - update - productForm not valid');
        $scope.$broadcast('show-errors-check-validity', 'productForm');

        return false;
      }

      var product = $scope.product;
      product.productItemInStock = $scope.product.productItemInStock;

      console.log('products.client.controller - update - product.productId: ' +product.productId);
      console.log('products.client.controller - update - product.productItemInStock: ' +$scope.product.productItemInStock);

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
      var products = Products.query({
        'user': $scope.authentication.user._id
      });

      $scope.products = products;

      // Todo - set no. products correct
      var noProducts = 0;
      $scope.showAddProduct = true;

      if($scope.authentication.user.subscriptionplan === 'mmbasic' && noProducts > 4){
        $scope.showAddProduct = false;
      } else if($scope.authentication.user.subscriptionplan === 'mmprofessional' && noProducts > 10){
        $scope.showAddProduct = false;
      }
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
      $scope.twitterPostsAvailable = false;

      var varFacebookPosts = 0;
      var varPinterestPosts = 0;
      var varCodeSnippetPosts = 0;
      var varTwitterPosts = 0;

      ProductsServices.getPosts($scope.authentication.user._id,$stateParams.productId).then(function (Posts) {
        $scope.posts = Posts;
        for (var i in Posts) {
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Facebook') {
            varFacebookPosts += 1;
            $scope.facebookPostsAvailable = true;
          }
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Pinterest') {
            varPinterestPosts += 1;
            $scope.pinterestPostsAvailable = true;
          }
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Twitter') {
            varTwitterPosts += 1;
            $scope.twitterPostsAvailable = true;
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
        $scope.twitterPostsNo = varTwitterPosts;
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
      $scope.modalInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/products/client/views/edit-pinterest.product.modal.view.html',
        controller: function ($scope, Products) {
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
      $scope.modalInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/products/client/views/edit-facebook.product.modal.view.html',
        controller: function ($scope, Products) {
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
    // **        POST to FACEBOOK        **
    // **                                **
    // ************************************
    //
    $scope.postPost = function (isValid) {
      $scope.hideSpinner = false;

      console.log('product.client.controller - Start posting to Facebook');
      ProductsServices.postToWall($scope.product).then(function(promise) {
        $scope.success = promise;
        $scope.hideSpinner = true;
      });
    };


    // ************************************
    // **                                **
    // **        POST to PINTEREST       **
    // **                                **
    // ************************************
    //
    $scope.postPostPinterest = function (isValid) {
      $scope.hideSpinner = false;

      console.log('products.client.controller - postPostPinterest - Start');
      ProductsServices.postToPinterest($scope.product).then(function(promise) {
        $scope.success = promise;
        $scope.hideSpinner = true;
      });
    };

    // ************************************
    // **                                **
    // **        POST to TWITTER         **
    // **                                **
    // ************************************
    //
    $scope.postPostTwitter = function (isValid) {
      $scope.hideSpinner = false;

      console.log('products.client.controller - postPostTwitter - Start');
      ProductsServices.postToTwitter($scope.product, $scope.authentication.user.twitterAccessToken, $scope.authentication.user.twitterAccessTokenSecret).then(function(promise) {
        $scope.success = promise;
        $scope.hideSpinner = true;
      });
    };


    // ************************************
    // **                                **
    // **        POST to Etsy            **
    // **                                **
    // ************************************
    //
    $scope.getEtsyOAuth = function (isValid) {


    };


    // Close Modal
    $scope.cancelModal = function () {
      $scope.modalInstance.$dismiss();
    };
  }
]);
