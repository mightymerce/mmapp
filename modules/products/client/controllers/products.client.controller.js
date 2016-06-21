'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$rootScope','$scope', '$state', '$http', '$timeout', '$window', '$stateParams', '$location', 'Authentication', 'Products', '$uibModal', 'Posts', 'ProductsServices', 'Taxes', 'Currencys', 'Deliverys', 'Users', 'ChoutServices',
  function ($rootScope, $scope, $state, $http, $timeout, $window, $stateParams, $location, Authentication, Products, $uibModal, Posts, ProductsServices, Taxes, Currencys, Deliverys, Users, ChoutServices) {

    $scope.authentication = Authentication;

    var PDK = $window.PDK;
    $scope.hideSpinner = true;
    $scope.merchantFBWall = true;

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

    // Load page after Instagram callback
    if($location.search().code){
      console.log('products.client.controller - load page after callback Instagram - start');
      // should return oauth_token & oauth_verifier
      var instagramCode = $location.search().code;
      console.log('products.client.controller - load page after callback Instagram - code: ' +instagramCode);

      var callback_url = '';

      if ($location.host() === 'localhost'){
        callback_url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/products?this=' + $location.search().this;
      } else {
        callback_url = $location.protocol() + '://' + $location.host() + '/products/?this=' + $location.search().this;
      }

      // get Instagram Access Token
      var promiseOAuthVerifierInstagram = ProductsServices.instagramGetAccessToken(instagramCode, $location.search().this);
      promiseOAuthVerifierInstagram.then(function(promise) {

        console.log('products.client.controller - load page after callback Instagram - return: ' +promise.access_token);

        // todo store instagram user data for further requests
        var user = new Users($scope.user);
        user.instagramAccessToken = promise.access_token;

        user.$update(function (response) {
          Authentication.user = response;
          console.log('products.client.controller - load page after callback Instagram - success');
          // Redirect to product detail page and open modal there
          var redirectURL = '';
          if ($location.host() === 'localhost'){
            redirectURL = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/products/' + $location.search().this + '/editmedia?instco=success';
          } else {
            redirectURL = $location.protocol() + '://' + $location.host() + '/products/' + $location.search().this + '/editmedia?instco=success';
          }
          window.open(redirectURL, "_self");

        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
          var redirectURL = '';
          if ($location.host() === 'localhost'){
            redirectURL = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/products/' + $location.search().this + '/editmedia?instco=error';
          } else {
            redirectURL = $location.protocol() + '://' + $location.host() + '/products/' + $location.search().this + '/editmedia?instco=error';
          }
          window.open(redirectURL, "_self");
        });

      });
    } else {
      if ($location.search().error)
      {
        $scope.error = 'You did not grant mightymerce access to your Instagram account yet.';
        console.log('productsmedia.client.controller - load page after callback Instagram - error');
      }
    }

    console.log('products.client.controller - load ProductsController');

    $scope.modalupdateProductPost = function (size, selectedProduct, postChannel, postStatus, postPublicationDate, postComment) {

      console.log('products.client.controller - start open modal - ModalUpateProductPost');
      if (postChannel === 'Facebook') {
        // Facebook connect
        var FBAccess_Token = '';
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

              var uid = response.authResponse.userID;
              $scope.authentication.user.accessToken = response.authResponse.accessToken;

              console.log('products.client.controller - modalupdateProductPost - Facebook connected open modal');

              ChoutServices.getCurrency($scope.product.productCurrency).then(function (Currencys){
                $scope.modalInstance = $uibModal.open({
                  //animation: $scope.animationsEnabled,
                  templateUrl: 'modules/products/client/views/post.product.modal.view.html',
                  controller: function ($scope, product) {
                    $scope.product = product;
                    $scope.varPostStatus = postStatus;
                    $scope.varPostPublicationDate = postPublicationDate;
                    $scope.varPostChannel = postChannel;
                    $scope.currency = Currencys;
                    $scope.productImportDawanda = false;
                    $scope.productImportEtsy = false;
                    if ($scope.product.productImport === 'Dawanda')
                    {
                      $scope.productImportDawanda = true;
                    }
                    if ($scope.product.productImport === 'Etsy')
                    {
                      $scope.productImportEtsy = true;
                    }
                  },
                  size: size,
                  resolve: {
                    product: function () {
                      return selectedProduct;
                    }
                  }
                });
              });
              // OPEN MODAL

            } else if (response.status === 'not_authorized') {
              // The person is logged into Facebook, but not your app.
              $scope.hideSpinner = true;
              console.log('products.client.controller - modalupdateProductPost - Not authorized');
              $scope.error = 'The user you are currently logged in to facebook is not authorized for Mightymerce. Please switch to your authorized user or log off from facebook and click again on "Create Post" to authorize your current facebook user.';

            }
            else {
              // Note: The call will only work if you accept the permission request

              console.log('product.client.controller - Start posting to Facebook');
              ProductsServices.postToWall($scope.product, FBAccess_Token).then(function(promise) {
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
          ChoutServices.getCurrency($scope.product.productCurrency).then(function (Currencys){
            $scope.modalInstance = $uibModal.open({
              //animation: $scope.animationsEnabled,
              templateUrl: 'modules/products/client/views/post.product.modal.view.html',
              controller: function ($scope, product) {
                $scope.product = product;
                $scope.varPostStatus = postStatus;
                $scope.varPostPublicationDate = postPublicationDate;
                $scope.varPostChannel = postChannel;
                $scope.currency = Currencys;
                if ($scope.product.productImport === 'Dawanda')
                {
                  $scope.productImportDawanda = true;
                }
                if ($scope.product.productImport === 'Etsy')
                {
                  $scope.productImportEtsy = true;
                }
              },
              size: size,
              resolve: {
                product: function () {
                  return selectedProduct;
                }
              }
            });
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

      if (postChannel === 'Twitter') {
        if ((!$scope.authentication.user.twitterAccessToken && !$scope.authentication.user.twitterAccessTokenSecret) || ($scope.authentication.user.twitterAccessToken === '' && $scope.authentication.user.twitterAccessTokenSecret === ''))
        {
          // Twitter connect
          console.log('products.client.controller - modalupdateProductPost - Twitter - Start');

          var promiseOAuth = ProductsServices.twitterGetOAuthToken($scope.product._id);
          promiseOAuth.then(function successCallback(response) {
            window.open('https://api.twitter.com/oauth/authenticate?oauth_token=' +response, "_self");
          });
        }
        else
        {
          console.log('products.client.controller - modalupdateProductPost - Twitter - twitterVerifyCredentials - AccessToken: ' +$scope.authentication.user.twitterAccessToken);

          //if the user is a returning user, hide the sign in button and display the tweets
          var promiseOAuthTwitter = ProductsServices.twitterVerifyCredentials($scope.authentication.user.twitterAccessToken, $scope.authentication.user.twitterAccessTokenSecret);
          promiseOAuthTwitter.then(function successCallback(response) {
            if (response === 'valid') {
              // user is valid Twitter User
              // OPEN MODAL
              ChoutServices.getCurrency($scope.product.productCurrency).then(function (Currencys){
                $scope.modalInstance = $uibModal.open({
                  //animation: $scope.animationsEnabled,
                  templateUrl: 'modules/products/client/views/post.product.modal.view.html',
                  controller: function ($scope, product) {
                    $scope.product = product;
                    $scope.varPostStatus = postStatus;
                    $scope.varPostPublicationDate = postPublicationDate;
                    $scope.varPostChannel = postChannel;
                    $scope.currency = Currencys;
                    if ($scope.product.productImport === 'Dawanda')
                    {
                      $scope.productImport = true;
                    }
                  },
                  size: size,
                  resolve: {
                    product: function () {
                      return selectedProduct;
                    }
                  }
                });
              });
            }

            else {
              // Twitter connect to get new credentials
              console.log('products.client.controller - modalupdateProductPost - Twitter - get new credentials');

              var promiseOAuthTwitter = ProductsServices.twitterGetOAuthToken($scope.product._id);
              promiseOAuthTwitter.then(function successCallback(response) {
                window.open('https://api.twitter.com/oauth/authorize?oauth_token=' +response, "_self");
              });
            }

          });
        }
      }

      if (postChannel === 'Instagram') {

        console.log('products.client.controller - modalupdateProductPost - Instagram - open modal');

        $scope.modalInstance = $uibModal.open({
          //animation: $scope.animationsEnabled,
          templateUrl: 'modules/products/client/views/post.product.modal.view.html',
          controller: function ($scope, product) {
            $scope.product = product;
            $scope.varPostStatus = postStatus;
            $scope.varPostPublicationDate = postPublicationDate;
            $scope.varPostChannel = postChannel;
            if ($scope.product.productImport === 'Dawanda')
            {
              $scope.productImport = true;
            }
          },
          size: size,
          resolve: {
            product: function () {
              return selectedProduct;
            }
          }
        });
      }

      if (postChannel === 'Code') {

        console.log('products.client.controller - modalupdateProductPost - Code - open modal');

        ChoutServices.getCurrency($scope.product.productCurrency).then(function (Currencys){
          var linkUrl = $location.protocol() + '://' + $location.host();
          if($location.host() === 'localhost'){
            linkUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/' + $scope.product._id + '?channel=code';
          } else {
            linkUrl = $location.protocol() + '://' + $location.host() + '/checkouts/' + $scope.product._id + '?channel=code';
          }
          $scope.linkUrl = linkUrl;

          var linkMainImageUrl = $location.protocol() + '://' + $location.host();
          if($location.host() === 'localhost'){
            linkMainImageUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + $scope.product.productMainImageURLFacebook.substring(1);
          } else {
            linkMainImageUrl = $location.protocol() + '://' + $location.host() + $scope.product.productMainImageURLFacebook.substring(1);
          }
          $scope.linkMainImageUrl = linkMainImageUrl;

          //var price = $scope.product.productPrice + ' EUR';
          var price = $scope.product.productPrice + ' ' + Currencys.currencyCode;
          $scope.price = price;

          $scope.modalInstance = $uibModal.open({
            //animation: $scope.animationsEnabled,
            templateUrl: 'modules/products/client/views/post.product.modal.view.html',
            controller: function ($scope, product) {

              $scope.product = product;
              $scope.varPostStatus = postStatus;
              $scope.varPostPublicationDate = postPublicationDate;
              $scope.varPostChannel = postChannel;
              $scope.varPostComment = postComment;
              $scope.copycode = '<div class="container">' +
                  '<div class="row">' +
                  '<div class="col-md-12">' +
                  '<div class="col-sm-6 col-md-4">' +
                  '<div class="thumbnail" >' +
                  '<img src="' + linkMainImageUrl + '" class="img-responsive">' +
                  '<div class="caption">' +
                  '<div class="row">' +
                  '<div class="col-md-12 col-xs-12">' +
                  '<h3>' + $scope.product.productTitle + '</h3>' +
                  '</div>' +
                  '<div class="col-md-12 col-xs-12">' +
                  '<label>' + price + '</label>' +
                  '</div>' +
                  '</div>' +
                  '<p>' + $scope.product.productDescription + '</p>' +
                  '<div class="row">' +
                  '<div class="col-md-6">' +
                  '<a href="' + linkUrl + '" class="btn btn-warning btn-product"><span class="glyphicon glyphicon-shopping-cart"></span> Jet!</a>' +
                  '</div>' +
                  '</div>' +
                  '<p> </p>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">' +
                  '<!-- Optionales Theme -->' +
                  '<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">';
            },
            size: size,
            resolve: {
              product: function () {
                return selectedProduct;
              }
            }
          });
        });

      }

    };

    $scope.modalMarketplace = function (size) {

      console.log('products.client.controller - start open modal - modalMarketplace');

      $scope.modalInstance = $uibModal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/products/client/views/marketplace.product.modal.view.html',
        controller: function ($scope) {

        },
        size: size,
        resolve: {
          product: function () {
            return "";
          }
        }
      });

      console.log('products.client.controller - end open modal - modalMarketplace');
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
        instagramImageId: this.instagramImageId,
        instagramImagesLow_resolutionUrl: this.instagramImagesLow_resolutionUrl,
        instagramImagesStandard_resolutionUrl: this.instagramImagesStandard_resolutionUrl,
        instagramImagesThumbnailUrl: this.instagramImagesThumbnailUrl,
        productCheckoutURL: linkUrl,
        productImport: this.productImport,
        productImportURL: this.productImportURL
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
      }, function (product) {
        $scope.instagramImageSet = false;
        if ($scope.product.instagramImageId || $scope.product.instagramImageId !== "")
        {
          $scope.instagramImageSet = true;
        }
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
      $scope.instagramPostsAvailable = false;

      var varFacebookPosts = 0;
      var varPinterestPosts = 0;
      var varCodeSnippetPosts = 0;
      var varTwitterPosts = 0;
      var varInstagramPosts = 0;

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
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Code') {
            varCodeSnippetPosts += 1;
            $scope.codeSnippetPostsAvailable = true;
          }
          if (Posts[i].product === $stateParams.productId && Posts[i].postChannel === 'Instagram') {
            varInstagramPosts += 1;
            $scope.instagramPostsAvailable = true;
          }
        }

        $scope.facebookPostsNo = varFacebookPosts;
        $scope.pinterestPostsNo = varPinterestPosts;
        $scope.codeSnippetPostsNo = varCodeSnippetPosts;
        $scope.twitterPostsNo = varTwitterPosts;
        $scope.instagramPostsNo = varInstagramPosts;


        console.log('products.client.controller - findone() - instagramImageSet: ' +$scope.instagramImageSet);
      });

    };


    // ************************************
    // **                                **
    // **   Send eMail Marketplace       **
    // **                                **
    // ************************************
    //
    $scope.sendMarketplaceRequest = function (isValid) {
      $scope.hideSpinner = true;

      console.log('products.client.controller - sendMarketplaceRequest - Start');

      console.log('$scope.category1 :' + $scope.category1);

      ProductsServices.sendMarketplaceRequestemail($scope.authentication.user.displayName, $scope.authentication.user.username, $scope.category1, $scope.category2, $scope.category3, $scope.category4, $scope.category5, $scope.category6, $scope.category7, $scope.category8, $scope.category9, $scope.category10, $scope.category11, $scope.category12, $scope.pinterestUser).then(function(promise) {
        $scope.hideSpinner = false;
        if (promise) {
          $scope.success = 'Wir haben deine Nachricht erhalten und werden dir die gewünschten mightymerce Pinterest Marktptlätze umgehend freischalten. Viel Spass beim Verkaufen!';
          $scope.hideSpinner = true;
        }
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
      ProductsServices.postToWall($scope.product, $scope.authentication.user.accessToken, $scope.category1, $scope.category2, $scope.category3, $scope.category4, $scope.category5, $scope.category6, $scope.category7, $scope.category8, $scope.category9, $scope.category10, $scope.category11, $scope.category12, $scope.merchantFBWall, $scope.merchantDawanda, $scope.merchantEtsy).then(function(promise) {
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
      ProductsServices.postToPinterest($scope.product, $scope.merchantDawanda, $scope.merchantEtsy).then(function(promise) {
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
      ProductsServices.postToTwitter($scope.product, $scope.authentication.user.twitterAccessToken, $scope.authentication.user.twitterAccessTokenSecret, $scope.merchantDawanda).then(function(promise) {
        $scope.success = promise;
        $scope.hideSpinner = true;
      });
    };


    // ************************************
    // **                                **
    // **        POST to INSTAGRAM       **
    // **                                **
    // ************************************
    //
    $scope.postPostInstagram = function (isValid) {
      $scope.hideSpinner = false;

      console.log('products.client.controller - postPostInstagram - Start');
      ProductsServices.instagramPostComment($scope.product, $scope.authentication.user, $scope.merchantDawanda).then(function(promise) {
        $scope.success = promise;
        $scope.hideSpinner = true;
      });
    };

    // ************************************
    // **                                **
    // **        POST to Code Snippet    **
    // **                                **
    // ************************************
    //
    $scope.postPostCode = function (isValid) {
      $scope.hideSpinner = false;

      console.log('products.client.controller - postPostCode - Start');
      ProductsServices.codesnippetPostComment($scope.product, $scope.postInformation).then(function(promise) {
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


    // ************************************
    // **                                **
    // **     Import from Dawanda        **
    // **         or Etsy                **
    // **                                **
    // ************************************
    //


    $scope.getProductImport = function (isValid) {

      var parsedURL = new URL($scope.importURL);
      var array = parsedURL.pathname.split('/');

      if (parsedURL.hostname === 'www.etsy.com') {

        var etsyProductId = array[3];
        var etsyArray;
        var etsyArrayImages;

        ProductsServices.etsyGetSelectedProduct(etsyProductId).then(function(promiseProduct) {

          //console.log(promiseProduct.body);
          etsyArray = JSON.parse(promiseProduct.body);

          ProductsServices.etsyGetSelectedProductImages(etsyProductId).then(function(promiseProductImages) {
            etsyArrayImages = JSON.parse(promiseProductImages.body);
            console.dir(etsyArrayImages);

            $scope.productId = etsyArray.results[0].listing_id;
            $scope.productTitle = etsyArray.results[0].title;
            $scope.productDescription = etsyArray.results[0].description;
            $scope.productPrice = etsyArray.results[0].price;
            //$scope.productCurrency = etsyArray.results.currency_code;
            $scope.productItemInStock = 1;
            $scope.productImport = 'Etsy';
            $scope.productImportURL = etsyArray.results[0].url;
            $scope.productMainImageURL = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageURLFacebook = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageURLTwitter = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageURLPinterest = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageURLEtsy = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageURLDawanda = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageURLCode = etsyArrayImages.results[0].url_fullxfull;
            $scope.productMainImageAlt = etsyArray.results[0].title;
          });
        });

      } else if (parsedURL.hostname === 'de.dawanda.com') {

        var dawandaProductIdarray = array[2].split('-');
        var dawandaProductId = dawandaProductIdarray[0];

        ProductsServices.dawandaGetSelectedProduct(dawandaProductId).then(function(promiseProduct) {

          var jsonResponse = JSON.parse(promiseProduct);

          $scope.productId = jsonResponse.response.result.product.id;
          $scope.productTitle = jsonResponse.response.result.product.name;
          $scope.productDescription = jsonResponse.response.result.product.description + '\r\n' +
              jsonResponse.response.result.product.size_description  + '\r\n' +
              jsonResponse.response.result.product.individualisation_description;
          $scope.productPrice = jsonResponse.response.result.product.price.cents.toString().substring(0,jsonResponse.response.result.product.price.cents.toString().length-2) + '.' + jsonResponse.response.result.product.price.cents.toString().substring(jsonResponse.response.result.product.price.cents.toString().length-2);
          //$scope.productCurrency = jsonResponse.response.result.product.price.currency_code.iso_code;
          $scope.productItemInStock = 1;
          $scope.productImport = 'Dawanda';
          $scope.productImportURL = jsonResponse.response.result.product.product_url;
          $scope.productMainImageURL = jsonResponse.response.result.product.default_image.full;
          $scope.productMainImageURLFacebook = jsonResponse.response.result.product.default_image.product_l;
          $scope.productMainImageURLTwitter = jsonResponse.response.result.product.default_image.product_l;
          $scope.productMainImageURLPinterest = jsonResponse.response.result.product.default_image.big;
          $scope.productMainImageURLEtsy = jsonResponse.response.result.product.default_image.full;
          $scope.productMainImageURLDawanda = jsonResponse.response.result.product.default_image.full;
          $scope.productMainImageURLCode = jsonResponse.response.result.product.default_image.product_l;
          $scope.productMainImageAlt = jsonResponse.response.result.product.name;

        });
      } else {
        $scope.error = 'Deine eingegebene URL ist leider nicht von Etsy oder Dawanda. Bitte teile uns gerne mit von welcher Plattform du Produkte importieren möchtest. So können wir unseren Service stetig für dich verbessern.'
      }
    };

    // Close Modal
    $scope.cancelModal = function () {
      $scope.modalInstance.$dismiss();
    };
  }
]);
