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


//Service to retrieve posts per product
angular.module('products').factory('ProductsServices', ['$http', '$q', 'Posts', '$window', '$location',
  function ($http, $q, Posts, $window, $location) {
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

        FB.login(function(response){

          if (response.status === 'connected') {
            var token = response.authResponse.accessToken;
            console.log('AccessToken: ' +token);
            return response;
          }
        },{ scope: 'publish_actions' });


      },

      getFacebookLoginStatus: function() {
        console.log('products.client.service - getFacebookLoginStatus');
        var FB = $window.FB;

        FB.getLoginStatus(function(response){
          console.log('products.client.service - getFacebookLoginStatus - return: '+response.status);
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


        console.log('product.client.service - postToWall - linkURL: ' +linkUrl);
        var deferred = $q.defer();
        var params = {};

        params.message = product.productTitle + ' für ' +product.productPrice + ' ' +product.productCurrency;
        params.name = product.productTitle;
        params.link = linkUrl +product._id + '?channel=facebook';
        params.picture = product.productMainImageURL;
        params.description = product.productDescription;

        var FB = $window.FB;

        // Make post to facebook and wait for answer
        FB.api('/me/feed', 'post', params, function(response)
        {
          if (!response || response.error) {
            console.log('product.client.service - postToWall - error occured post to Facebook' +response.error.message);
            deferred.reject('Error occured');
          } else {
            // Create new Post object
            var post = new Posts({
              product: product._id,
              channel: '563c7fab09f30c482f304273',
              postChannel: 'Facebook',
              postId: response.id,
              postStatus: 'Active',
              postPublicationDate: new Date(),
              postExternalPostKey: response.id
            });

            // Save post to MM
            post.$save(function (response) {
              console.log('product.client.service - postToWall - save post on MM success!');
            }, function (errorResponse) {
              console.log('product.client.service - postToWall - save post on MM error: ' +errorResponse);
            });
            deferred.resolve(response.id);
            console.log('Success post to Facebook postToWall - Post ID: ' + response.id);
          }
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
        PDK.getSession()(function(response){
          return response;
        });
      },


      getPinterestLogin: function() {
        var varReturnMessage = '';
        var PDK = $window.PDK;

        PDK.login({ scope : 'read_public, write_public' }, function(session) {
          if (!session) {
            varReturnMessage = 'The user choose not to grant permissions or closed the pop-up';
            return varReturnMessage;
          } else {
            console.log('Thanks for authenticating. Getting your information...');
            PDK.me(function(response) {
              if (!response || response.error) {
                varReturnMessage = 'Oops, there was a problem getting your information';
                return varReturnMessage;
              } else {
                varReturnMessage = 'Welcome,  ' + response.data.first_name + '! You are now connected to Pinterest! Please click on "Create Post again"!';
                return varReturnMessage;
              }
            });
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

        console.log('Start post to Pinterest postToPinterest!');
        var deferred = $q.defer();


        var link = 'http://localhost:3001/checkouts/' +product._id;
        var image_url = product.productMainImageURL;
        var note = product.productTitle + ' für ' +product.productPrice + ' ' +product.productCurrency.selectedOption.name + ' ' + product.productDescription;

        var PDK = $window.PDK;
        // Make post to facebook and wait for answer
        PDK.pin(image_url, note, link, function(response) {
          // do something
          // Create new Post object
          var post = new Posts({
            product: product._id,
            channel: '563c7fab09f30c482f304273',
            postChannel: 'Pinterest',
            postId: response.id,
            postStatus: 'Active',
            postPublicationDate: new Date(),
            postExternalPostKey: response.id
          });

          // Save post to MM
          post.$save(function (response) {
            console.log('Save Post on MM success!');
          }, function (errorResponse) {
            console.log('Save Post on MM error: ' +errorResponse);
          });
          deferred.resolve(response.id);
        });

        return deferred.promise;
      }



    };
  }
]);




/*angular.module('products').factory('facebookService', function($q, Facebook) {
  return {
    loginFacebook: function() {
      Facebook.login(function(response){
        if (response.status === 'connected') {
          var token = response.authResponse.accessToken;
          console.log('AccessToken: ' +token);
          return response;
        }
      },{ scope: 'publish_actions' });
    },


    getMyLastName: function() {
      console.log('Facebook: GetMyLastName ');
      var deferred = $q.defer();
      console.log('FB Object: ' +Facebook);
      Facebook.api('/me', {
        fields: 'last_name'
      }, function(response) {
        if (!response || response.error) {
          console.log('Error: ' +response.error);
          deferred.reject('Error occured');
        } else {
          console.log('Success: ' +response);
          deferred.resolve(response);
        }
      });
      return deferred.promise;
    }
  };
});*/
