'use strict';

//Products service used for communicating with the products REST endpoints
angular.module('products').factory('Products', ['$resource',
  function ($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('products').factory('GetDawanda', ['$resource',
  function($resource) {
    return $resource('/api/users/auth/getdawanda', {
    }, {
      query: { method: 'GET', isArray: false }
    });
  }
]);


//Service to retrieve posts per product
angular.module('products').factory('ProductsServices', ['$http', '$q', 'Posts', '$window', '$location', 'Currencys',
  function ($http, $q, Posts, $window, $location, Currencys) {

    var authorizationResult = false;

    return {
      getPosts: function getPosts(userid, id) {
        var promise = $http({
          method: 'GET',
          url: '/api/posts?user=' + userid + '&product=' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('products.client.service.js - GetPosts for ProductId: ' +id);
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      postPosts: function postPosts(product) {
        var promise = $http({
          method: 'POST',
          url: '/api/posts/'
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('products.client.service.js - postPosts');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getProducts: function getProducts() {
        var promise = $http({
          method: 'GET',
          url: '/api/products/'
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('products.client.service.js - GetProducts');
          // The return value gets picked up by the then in the controller.
          //for (var i = 0; i < data.length; i ++) {
          //jobs.push(new Job(data.objects[i]));
          //}
          //var deferred = $q.defer();

          $http.get('/api/products/').success(function(data) {
            console.log('Data: ' +data[0].productId);
            var jobs = [];
            for (var i = 0; i < data.length; i ++) {


              //jobs.push(new Job(data.objects[i]));
            }
            //deferred.resolve(jobs);
          });

          //return deferred.promise;

          return response.data;


        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },




      // ************************************
      // **                                **
      // **           Facebook             **
      // **           services             **
      // **                                **
      // ************************************
      //
      //
      loginFacebook: function() {
        var FB = $window.FB;
        var deferred = $q.defer();

        FB.login(function(response){

          if (response.status === 'connected') {
            deferred.resolve('You are now connected to your facebook account! Please click "Create Post" again.');
          }
          else {
            deferred.reject('There went something wrong connecting to your facebook account or you canceled the action.');
          }
        },{ scope: 'publish_actions' });
        return deferred.promise;

      },

      getFacebookLoginStatus: function() {
        console.log('products.client.service - getFacebookLoginStatus');
        var FB = $window.FB;

        FB.getLoginStatus(function(response){
          console.log('products.client.service - getFacebookLoginStatus');
          return response.status;
        });
      },

      postProcessFacebook: function(product) {
        var deferred = $q.defer();

      },

      postToWall: function (product) {

        console.log('product.client.service - postToWall - start post to Facebook!');
        var linkUrl = $location.protocol() + '://' + $location.host();
        if($location.host() === 'localhost'){
          linkUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/';
        } else {
          linkUrl = $location.protocol() + '://' + $location.host() + '/checkouts/';
        }

        var linkMainImageUrl = $location.protocol() + '://' + $location.host();
        if($location.host() === 'localhost'){
          linkMainImageUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();
        } else {
          linkMainImageUrl = $location.protocol() + '://' + $location.host();
        }

        var deferred = $q.defer();
        var params = {};

        $http.get('/api/currencys/' +product.productCurrency)

          .success(function (response) {
            // this callback will be called asynchronously
            // when the response is available

            // params.message = product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode;
            console.log('product.client.service - postToWall - currency: ' + response.currencyCode);

            params.name = product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode;
            params.link = linkUrl + product._id + '?channel=facebook';
            params.picture = linkMainImageUrl + product.productMainImageURLFacebook.substring(1);
            params.description = product.productDescription.substring(0,220) + ' ' + 'BUY NOW';
            params.type = 'product';

            console.log('product.client.service - postToWall - productMainImageURL ' + params.picture);

            var FB = $window.FB;

            // Make post to facebook and wait for answer
            FB.api('/me/feed', 'post', params, function (response) {
              if (!response || response.error) {
                console.log('product.client.service - postToWall - error occured post to Facebook');
                deferred.reject('There was an error creating Facebook post. Please try again!');
              } else {
                // Create new Post object
                var post = new Posts({
                  product: product._id,
                  channel: '563c7fab09f30c482f304273',
                  postChannel: 'Facebook',
                  postId: response.id,
                  postStatus: 'Active',
                  postPublicationDate: new Date(),
                  postExternalPostKey: response.id,
                  postInformation: ''
                });

                // Save post to MM
                post.$save(function (response) {
                  console.log('product.client.service - postToWall - save post on MM success Post ID: ' + response._id);
                  deferred.resolve('Success posting to Facebook! - Mightymerce Post-Id: ' +response._id);
                }, function (errorResponse) {
                  console.log('product.client.service - postToWall - save post on MM error: ' + errorResponse);
                  deferred.reject(errorResponse);
                });
              }
            });
          })
            .error(function(msg,code) {
            });
        return deferred.promise;
      },

      // ************************************
      // **                                **
      // **          Pinterest             **
      // **           services             **
      // **                                **
      // ************************************
      //
      //

      getPinterestSession: function() {
        var PDK = $window.PDK;
        PDK.getSession (function(response){
          return response;
        });
      },


      getPinterestLogin: function() {
        var varReturnMessage = '';
        var PDK = $window.PDK;

        PDK.login({ scope : 'read_public, write_public' }, function(session) {
          if (!session) {
            console.log('products.client.service - getPinterestLogin - user did not grant permission');
            varReturnMessage = 'cancel';
            return varReturnMessage;
          } else {
            console.log('products.client.service - getPinterestLogin - user did authenticate');
            return session;
          }
        });
      },

      getPinterestMe: function() {
        var varReturnMessage = '';
        var PDK = $window.PDK;

        PDK.me(function(response) {
          if (!response || response.error) {
            varReturnMessage = 'error';
            return varReturnMessage;
          } else {
            varReturnMessage = 'Welcome,  ' + response.data.first_name + '! You are now connected to Pinterest! Please click on "Create Post again"!';
            return varReturnMessage;
          }
        });
      },

      setPinterestSession: function() {
        var PDK = $window.PDK;
        PDK.setSession(function(response) {
          return response;
        });
      },

      postToPinterest: function (product) {

        console.log('products.client.service - postToPinterest - Start post to Pinterest');
        var deferred = $q.defer();

        var linkUrl = $location.protocol() + '://' + $location.host();
        if($location.host() === 'localhost'){
          linkUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/';
        } else {
          linkUrl = $location.protocol() + '://' + $location.host() + '/checkouts/';
        }

        var linkMainImageUrl = $location.protocol() + '://' + $location.host();
        if($location.host() === 'localhost'){
          linkMainImageUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();
        } else {
          linkMainImageUrl = $location.protocol() + '://' + $location.host();
        }

        $http.get('/api/currencys/' +product.productCurrency)
          .success(function (response) {
            // this callback will be called asynchronously
            // when the response is available

            var link = linkUrl +product._id + '?channel=pinterest';
            var image_url = linkMainImageUrl + product.productMainImageURLPinterest.substring(1);
            var note = product.productTitle + ' für ' +product.productPrice + ' ' +response.currencyCode + ' ' + product.productDescription;

            var PDK = $window.PDK;
            // Make post to pinterest and wait for answer
            PDK.pin(image_url, note, link, function(response) {
              // Pinterest so far does not provide any response
              if (!response) {
                // Create new Post object
                var post = new Posts({
                  product: product._id,
                  channel: '563c7fab09f30c482f304273',
                  postChannel: 'Pinterest',
                  postId: Math.random().toString(36).slice(2), // Pinterest does not respond with a id
                  postStatus: 'Active',
                  postPublicationDate: new Date(),
                  postExternalPostKey: 'not available',
                  postInformation: ''
                });
                // Save post to MM
                post.$save(function (response) {
                  console.log('products.client.service - postToPinterest - Save Post on MM success!');
                  deferred.resolve('Success posting to Pinterest! - Mightymerce Post-Id: ' + response._id);
                  return deferred.promise;
                }, function (errorResponse) {
                  console.log('products.client.service - postToPinterest - Save Post on MM error: ' + errorResponse);
                  deferred.reject(errorResponse);
                  return deferred.promise;
                });
                //console.log('product.client.service - postToPinterest - error occured post to Pinterest' + response.error.message);
                //deferred.reject(response.error.message);
              } else {

                // Create new Post object
                var post = new Posts({
                  product: product._id,
                  channel: '563c7fab09f30c482f304273',
                  postChannel: 'Pinterest',
                  postId: 'xxx', //response.id,
                  postStatus: 'Active',
                  postPublicationDate: new Date(),
                  postExternalPostKey: '', //response.id
                  postInformation: ''
                });
                // Save post to MM
                post.$save(function (response) {
                  console.log('products.client.service - postToPinterest - Save Post on MM success!');
                  deferred.resolve('Success posting to Pinterest! - Mightymerce Post-Id: ' + response._id);
                  return deferred.promise;
                }, function (errorResponse) {
                  console.log('products.client.service - postToPinterest - Save Post on MM error: ' + errorResponse);
                  deferred.reject(errorResponse);
                  return deferred.promise;
                });
              }
            });
          })
          .error(function(msg,code) {

          });
        return deferred.promise;
      },


      // ************************************
      // **                                **
      // **          Twitter               **
      // **           services             **
      // **                                **
      // ************************************
      //
      //
      postToTwitter: function (product, oauth_AccessToken, oauth_AccessTokenSecret) {

        console.log('product.client.service - postToTwitter - start post to Twitter!');

        var deferred = $q.defer();
        var params = {};

        $http.get('/api/currencys/' +product.productCurrency)
          .success(function (response) {
            // this callback will be called asynchronously
            // when the response is available

            var status = product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode + '. ' +product.productDescription;

            var url = '/api/users/twitter/twitterTweetStatus/' + oauth_AccessToken + '/' +oauth_AccessTokenSecret + '/' + status.substring(0,53) + '...' + '/' + product._id;
            $http.get(url).then(function (response) {
              // Error
              var responseMessage = response.toString();
              if (responseMessage.substring(0,6) === 'Error:')
              {
                console.log('products.client.service - postToTwitter - error connecting to Twitter: ' + response.substring(7));
                deferred.reject('There was an error while connecting to Twitter. Please try again.');
                return deferred.promise;
              }
              // Code != 200
              else if (responseMessage.substring(0,6) === 'Code: ')
              {
                console.log('products.client.service - postToTwitter - code != 200 connecting to Twitter: ' + response.substring(7));
                deferred.reject('Twitter responded but did not grant access. Please verify in your Twitter account.');
                return deferred.promise;
              }
              else
              {
                console.log('product.client.service - postToTwitter - return value id: ' +response.data.id);

                // The return value gets picked up by the then in the controller.
                // Save post to MM
                // Create new Post object
                var post = new Posts({
                  product: product._id,
                  channel: '263c7fab09f30c482f304273',
                  postChannel: 'Twitter',
                  postId: response.data.id,
                  postStatus: 'Active',
                  postPublicationDate: new Date(),
                  postExternalPostKey: response.data.id_str,
                  postInformation: ''
                });

                post.$save(function (res) {
                  console.log('products.client.service - postToTwitter - Save Post on MM success!');
                  deferred.resolve('Success posting to Twitter! - Mightymerce Post-Id: ' +response.data.id);
                  return deferred.promise;
                }, function (errorResponse) {
                  console.log('products.client.service - postToTwitter - Save Post on MM error: ' +errorResponse);
                  deferred.reject(errorResponse);
                  return deferred.promise;
                });
              }
            });
          })
          .error(function(msg,code) {

        });
        return deferred.promise;
      },

      twitterGetOAuthToken: function(productId) {
        console.log('product.client.service - twitterGetOAuthToken - start');
        var url = '/api/users/twitter/twitterGetOAuthToken/' +productId;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - twitterGetOAuthToken - return value: ' +response.data);
          return response.data;
        });
      },

      twitterGetAccessToken: function(oauth_Verifier, oauth_Token) {
        console.log('product.client.service - twitterGetAccessToken - start');

        var url = '/api/users/twitter/twitterGetAccessToken/' +oauth_Verifier + '/' +oauth_Token;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - twitterGetAccessToken - return value: ' +response.data);
          return response.data;
        });
      },

      twitterVerifyCredentials: function(oauth_AccessToken, oauth_AccessTokenSecret) {
        console.log('product.client.service - twitterVerifyCredentials - start');

        var url = '/api/users/twitter/twitterVerifyCredentials/' +oauth_AccessToken + '/' +oauth_AccessTokenSecret;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - twitterVerifyCredentials - return value: ' +response.data);
          return response.data;
        });
      },

      // ************************************
      // **                                **
      // **          Instagram             **
      // **           services             **
      // **                                **
      // ************************************
      //
      //
      instagramGetAccessToken: function(code, callback_uri) {
        console.log('product.client.service - instagramGetAccessToken - start');

        var url = '/api/users/instagram/instagramGetAccessToken/' + code + '/' + callback_uri;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - instagramGetAccessToken - return value: ' +response.data);
          return response.data;
        });
      },

      instagramGetMedia: function(access_token, callback_uri) {
        console.log('product.client.service - instagramGetMedia - start');

        var url = '/api/users/instagram/instagramGetMedia/' + access_token;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - instagramGetMedia - return value: ' +response.data);
          return response.data;
        });
      },

      instagramPostComment: function(product, user) {
        console.log('product.client.service - instagramPostComment - start');

        var deferred = $q.defer();
        var params = {};

        $http.get('/api/currencys/' +product.productCurrency)
            .success(function (response) {
              // this callback will be called asynchronously
              // when the response is available

              var status = product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode + '. ' +product.productDescription;
              var comment = status.substring(0,200) + '.   BUY NOW ';

              var url = '/api/users/instagram/instagramPostComment/' + user.instagramAccessToken + '/' + comment + '/' + product._id + '/' + product.instagramImageId;
              $http.get(url).then(function (response) {
                // Error
                var responseMessage = response.toString();
                if (responseMessage.substring(0,6) === 'Error:')
                {
                  console.log('products.client.service - instagramPostComment - error connecting to Instagram: ' + response.substring(7));
                  deferred.reject('There was an error while connecting to your Instagram account. Please try again.');
                  return deferred.promise;
                }
                // Code != 200
                else if (responseMessage.substring(0,6) === 'Code: ')
                {
                  console.log('products.client.service - instagramPostComment - code != 200 connecting to Twitter: ' + response.substring(7));
                  deferred.reject('Instagram responded but did not grant access. Please verify in your Instagram account.');
                  return deferred.promise;
                }
                else
                {
                  console.log('product.client.service - instagramPostComment - return success');

                  // The return value gets picked up by the then in the controller.
                  // Save post to MM
                  // Create new Post object
                  var post = new Posts({
                    product: product._id,
                    channel: '963c7fab09f30c482f304279',
                    postChannel: 'Instagram',
                    postId: Math.random().toString(36).slice(2), // Instagram does not respond with a id
                    postStatus: 'Active',
                    postPublicationDate: new Date(),
                    postExternalPostKey: 'not available',
                    postInformation: ''
                  });

                  post.$save(function (res) {
                    console.log('products.client.service - instagramPostComment - Save Post on MM success!');
                    deferred.resolve('Success posting to Instagram! - Mightymerce Post-Id: ' +res._id);
                    return deferred.promise;
                  }, function (errorResponse) {
                    console.log('products.client.service - instagramPostComment - Save Post on MM error: ' +errorResponse);
                    deferred.reject(errorResponse);
                    return deferred.promise;
                  });
                }
              });
            })
            .error(function(msg,code) {

            });
        return deferred.promise;

      },

      // ************************************
      // **                                **
      // **         Code Snippet           **
      // **           services             **
      // **                                **
      // ************************************
      //
      //
      codesnippetPostComment: function(product, postInformation) {
        console.log('product.client.service - codesnippetPostComment - start');

        var deferred = $q.defer();

        // Save post to MM
        // Create new Post object
        var post = new Posts({
          product: product._id,
          channel: '963c7fab09f30c482f304279',
          postChannel: 'Code',
          postId: Math.random().toString(36).slice(2), // Instagram does not respond with a id
          postStatus: 'Active',
          postPublicationDate: new Date(),
          postExternalPostKey: 'not available',
          postInformation: postInformation
        });

        post.$save(function (res) {
          console.log('products.client.service - codesnippetPostComment - Save Post on MM success!');
          deferred.resolve('Success saving your comment! - Mightymerce Post-Id: ' +res._id);
          return deferred.promise;
        }, function (errorResponse) {
          console.log('products.client.service - codesnippetPostComment - Save Post on MM error: ' +errorResponse);
          deferred.reject(errorResponse);
          return deferred.promise;
        });

        return deferred.promise;

      },

      // ************************************
      // **                                **
      // **             Etsy               **
      // **           services             **
      // **                                **
      // ************************************
      //
      //

      etsyGetOAuthToken: function(productId) {
        console.log('product.client.service - etsyGetOAuthToken - start');
        var url = '/api/users/etsy/etsyGetOAuthToken/' +productId;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - etsyGetOAuthToken - return value: ' +response.data);
          return response.data;
        });
      },

      etsyGetAccessToken: function(oauth_Verifier, oauth_Token, oauth_Token_Secret) {
        console.log('product.client.service - etsyGetAccessToken - start');

        var url = '/api/users/etsy/etsyGetAccessToken/' +oauth_Verifier + '/' +oauth_Token + '/' +oauth_Token_Secret;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - etsyGetAccessToken - return value: ' +response.data);
          return response.data;
        });
      },

      etsyGetMyProducts: function(oauth_AccessToken, oauth_AccessTokenSecret) {
        console.log('product.client.service - etsyGetMyProducts - start');

        var url = '/api/users/etsy/etsyGetMyProducts/' +oauth_AccessToken + '/' +oauth_AccessTokenSecret;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - etsyGetMyProducts - return value: ' +response.data);
          return response.data;
        });
      },

      // ************************************
      // **                                **
      // **            Dawanda             **
      // **           services             **
      // **                                **
      // ************************************
      //
      //

      dawandaGetOAuthToken: function(productId) {
        console.log('product.client.service - dawandaGetOAuthToken - start');
        var url = '/api/users/dawanda/dawandaGetOAuthToken/' +productId;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - dawandaGetOAuthToken - return value: ' +response.data);
          return response.data;
        });
      },

      dawandaGetAccessToken: function(oauth_Verifier, oauth_Token) {
        console.log('product.client.service - dawandaGetAccessToken - start');

        var url = '/api/users/dawanda/dawandaGetAccessToken/' +oauth_Verifier + '/' +oauth_Token;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - dawandaGetAccessToken - return value: ' +response.data);
          return response.data;
        });
      },

      dawandaGetMyProducts: function(oauth_AccessToken, oauth_AccessTokenSecret) {
        console.log('product.client.service - dawandaGetMyProducts - start');

        var url = '/api/users/dawanda/dawandaGetMyProducts/' +oauth_AccessToken + '/' +oauth_AccessTokenSecret;
        return $http.get(url).then(function (response) {
          console.log('product.client.service - dawandaGetMyProducts - return value: ' +response.data);
          return response.data;
        });
      }

    };
  }
]);
