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
        },{ scope: 'publish_actions, manage_pages, publish_stream' });
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

      postToWall: function (product, short_user_access_token, facebookCategory1, facebookCategory2, facebookCategory3, facebookCategory4, facebookCategory5, facebookCategory6, facebookCategory7, facebookCategory8, facebookCategory9, facebookCategory10, facebookCategory11, facebookCategory12, merchantFBWall, merchantDawanda) {

        console.log('product.client.service - postToWall - start post to Facebook!');
        var linkUrl;
        if (merchantDawanda) {
          linkUrl = product.productImportURL;
        }
        else {
          if($location.host() === 'localhost'){
            linkUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/'+ product._id + '?channel=facebook';
          } else {
            linkUrl = $location.protocol() + '://' + $location.host() + '/checkouts/' + product._id + '?channel=facebook';
          }
        }

        var linkMainImageUrl;
        if (merchantDawanda) {
          linkMainImageUrl = 'http:' + product.productMainImageURLFacebook;
        } else {
          if (product.productImport === 'Dawanda') {
            linkMainImageUrl = 'http:' + product.productMainImageURLPinterest;
          } else {
            if ($location.host() === 'localhost') {
              linkMainImageUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + product.productMainImageURLFacebook.substring(1);
            } else {
              linkMainImageUrl = $location.protocol() + '://' + $location.host() + product.productMainImageURLFacebook.substring(1);
            }
          }
        }

        var deferred = $q.defer();
        var params = {};
        var paramsFanPage = {};
        var paramsPage = {};

        $http.get('/api/currencys/' +product.productCurrency)

          .success(function (response) {
            // this callback will be called asynchronously
            // when the response is available

            // params.message = product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode;
            console.log('product.client.service - postToWall - currency: ' + response.currencyCode);

            $http.post('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBRGpeh01F10Do02XutBStFc-OyYwsuf1Y',{longUrl:linkUrl})
            .success(function(data,status,headers,config){
              params.name = product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode;
              params.link = data.id;
              //params.link = linkUrl;
              params.picture = linkMainImageUrl;
              params.description = product.productDescription.substring(0,220) + ' ' + 'BUY NOW';
              params.type = 'product';

              console.log('product.client.service - postToWall - productMainImageURL ' + params.picture);
              console.log('product.client.service - postToWall - linkURL ' + params.link);

              if(merchantFBWall) {
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
              }

              var FBPageId1 = '';
              var FBPermanent_access_token1 = '';
              var FBPageId2 = '';
              var FBPermanent_access_token2 = '';
              var FBPageId3 = '';
              var FBPermanent_access_token3 = '';
              var FBPageId4 = '';
              var FBPermanent_access_token4 = '';
              var FBPageId5 = '';
              var FBPermanent_access_token5 = '';
              var FBPageId6 = '';
              var FBPermanent_access_token6 = '';
              var FBPageId7 = '';
              var FBPermanent_access_token7 = '';
              var FBPageId8 = '';
              var FBPermanent_access_token8 = '';
              var FBPageId9 = '';
              var FBPermanent_access_token9 = '';
              var FBPageId10 = '';
              var FBPermanent_access_token10 = '';
              var FBPageId11 = '';
              var FBPermanent_access_token11 = '';
              var FBPageId12 = '';
              var FBPermanent_access_token12 = '';
              var FBclient_id = '1679726155619376';
              var FBclient_secret = '6049214cc55cfcfba761c2ba2976a1cc';


              // ************************************************************************
              // ************************************************************************
              // ************************* DO NOT DELETE ********************************
              //
              // ****************** Will be used for creating permanent tokens **********
              //
              //
              // How to get permantent access token
              // STEP 1.
              // https://graph.facebook.com/v2.2/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_token}
              //$http.get('https://graph.facebook.com/v2.2/oauth/access_token?grant_type=fb_exchange_token&client_id=1679726155619376&client_secret=6049214cc55cfcfba761c2ba2976a1cc&fb_exchange_token=EAAX3s7jTXDABADWPtQVZAYLKIoXeWZB9ABp0HILj3LgoJZBcdYBNIMZCV7Y9lTpY7DiOdSc0MkoClIu05wntiusAP3RNm6vSZA4FmZBYgYe4fqHSIVgSSRpk2j6P5ruXyH01AXdZBP6zYWPxLmGI7pcKZAtZA2DoZCpwEYywZBhuKfZCk9mRu5OKraqt');
              //
              // STEP 2.
              // https://graph.facebook.com/v2.2/me?access_token={long_lived_access_token}
              //$http.get('https://graph.facebook.com/v2.2/me?access_token=EAAX3s7jTXDABANQY2jPpqb5PtbWjZAtJSDgSs31jNjFukENzb3RWg2GPf9SqCY4DwJ3AvEFW23IN3pZBZBJmCZBKLvEGJ6nPCsKl7aPaa3gJcW0EnGq1Ug8E9h70sdoj1ZAPlZAfS1YzWmBpBZAq2q4bjt5c9ySBLwafd3tjXC4uwZDZD');
              //
              // STEP 3.
              // https://graph.facebook.com/v2.2/{account_id}/accounts?access_token={long_lived_access_token}
              //$http.get('https://graph.facebook.com/v2.2/1616329748693878/accounts?access_token=EAAX3s7jTXDABAEcdxyzbW2nMYvaah9dm4omgD70ifsX9ANWhzfx96Lti6aOLiEebpcAaQ6TgltFFU1GtZBTk7ZAhfzWyCRiiDEucVTsftLZAHnW8dgomlM2MMrHjwFLWE8ZBFZAkxmfpqBzJtSK7voFAckMfaq4174lsmJKxZAYQZDZD');
              //
              // Test Post to Page Wall (with id: 1807188706168776)
              //$http.post('https://graph.facebook.com/v2.2/1807188706168776/feed?access_token=EAAX3s7jTXDABAMRl2l1l1XmNclFZCBjwix0BsoEBqc6573fvZA54XdsqWOeB5eg1BTVCG441xiADZAikDmZBN1IXuVpsgGv7tRopEvQ8ZBUQBp4fnXymbSqQaL5CHSEhLs36DMN3v06TUFWoj8nuYr58eaLz3yIUZD&callback=FB.__globalCallbacks.f3e5854a96a0ad4&client_id=1679726155619376&client_secret=6049214cc55cfcfba761c2ba2976a1cc&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png&method=post&pretty=0&sdk=joey');
              //
              // ************************************************************************
              // ************************************************************************



              // Fanpage Wohnen & Einrichten - mightymerce - Marktplatz
              if (facebookCategory1) {
                FBPageId1 = '517236438401261';
                FBPermanent_access_token1 = 'EAAX3s7jTXDABALuR2eiGhZBxbRcueNHILrW1VLJBqPmnTON4yZCR4l1C50oYvwBE3lo5EDg8KLDYGdnvgN0uGhu96DgZAGeSCaNVtEMw1ZBH8tgyZCOkfmzOnrr6F1WNAUVQS0niZA3PfP0lEYMlOZCcrFzyFuUEF1NRcpiKKt1QwZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId1 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token1 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product')
                  .success(function (response) {
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
                      deferred.resolve('Success posting to mightymerce Marketplace - Wohnen & Einrichten! - Mightymerce Post-Id: ' +response._id);
                    }, function (errorResponse) {
                      console.log('product.client.service - postToWall - save post on MM error: ' + errorResponse);
                      deferred.reject(errorResponse);
                    });
                  })
                  .error(function(msg,code) {
                });
              }

              // Fanpage Heimwerk & Garten - mightymerce - Marktplatz
              if (facebookCategory2) {
                FBPageId2 = '1769765326572841';
                FBPermanent_access_token2 = 'EAAX3s7jTXDABAFTBOJ8pGZBA0QnwSsi7r34j5gMe7OtIh50WZC2MYXUr1E05YSybdF2zLNrDUzYlnVZAxfxhcuIsqLzRicQsX8p5VVoTG9lOR2AtDTZA6ZBnkCSxhjAhJZB3bVnvn3P89wpUBYyQBb4kzkzryPb5jbUe2eN5jsVgZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId2 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token2 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Gesundheit & Wohlbefinden - mightymerce - Marktplatz
              if (facebookCategory3) {
                FBPageId3 = '1641883656133169';
                FBPermanent_access_token3 = 'EAAX3s7jTXDABAO8ImY54d5nwSd8n6tSmZCkRWpAaacRqAojzW7v9evdNHwrTR8U2u7M1K4dRd6ZA3tUrQzRkmmj4ddJ6GeFco3tIg2Nr2IRnCDaBnZBHgKTtwYhd3X94ZBE1rn98b8fxhUqJjiuMUxhmCTQ0XvJhSFqkiDhvEAZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId3 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token3 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Kosmetik & Beauty - mightymerce - Marktplatz
              if (facebookCategory4) {
                FBPageId4 = '1795530264011817';
                FBPermanent_access_token4 = 'EAAX3s7jTXDABAN2SDRpiiNYcEGQPEvy6bZAhzGt4kkZBud2zTWJci1cPKb5aKtNLcceEIVEaM1yPw4v71qQbwCeG4JGc5BCUnyHrpbkXgPbpd2ZB0hMad32obV2TVCLGmoFiAWgPZCZA842fG3BxYvXANlieiNPf72O6DKEoT9AZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId4 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token4 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Bekleidung & Schuhe - mightymerce - Marktplatz
              if (facebookCategory5) {
                FBPageId5 = '582056861953932';
                FBPermanent_access_token5 = 'EAAX3s7jTXDABAE7zGfJbe4vZAhoaKroHLxUZBUJIsRFFvbSi7PIc5DNr6PjzQFh38hfmYbcSnwK0NflZABORv9tISh02WocmUABWZCMEIrczyl7gzHSpKKovUTWboo1veZBSUZAEOg7E8HTn6UQ7ukNA8MOpLYhVQG78ZAw6xoNeAZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId5 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token5 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Uhren & Schmuck - mightymerce - Marktplatz
              if (facebookCategory6) {
                FBPageId6 = '618470838308478';
                FBPermanent_access_token6 = 'EAAX3s7jTXDABANQCcikBiQpDqxZBuZAxae4GjREXwN8PncH3ZBWfZBVwZAEdfEqFz9ICDGhZBZCfacqmUvj90XdxZAwXNEetphnltZC9aZBcjQnIVhoEObTnZAM6yBefsZAFl1eXo7Rn3gP7gGZBBf7hsrLbpxCi2RZAioHbAZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId6 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token6 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Freizeit & Outdoor - mightymerce - Marktplatz
              if (facebookCategory7) {
                FBPageId7 = '376218112502073';
                FBPermanent_access_token7 = 'EAAX3s7jTXDABANCuJw9hJHwZBqPbYyjQBKv6i7Bq1hBoviI5dBqsyTydgPeN3sr5POL2W8vHclC6voirsZBjdlYKOFJAvNcQgUryJlqSCFbAacFH12m4X3pWDJSri8k378zTOOWEvQSHsClxP6vKyKahRbNXXze2xsWjZAVwQZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId7 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token7 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Sport & Fitness - mightymerce - Marktplatz
              if (facebookCategory8) {
                FBPageId8 = '1277168312300811';
                FBPermanent_access_token8 = 'EAAX3s7jTXDABAPo3lOu9dPj9ZBDHaCrkaSgIPI7kAnRbctHN7HDlpKvBHMWGzgbPJaS20Sc6ZBMXQhlXWzaXDYiVrM4EbcA3mgmuUMmIUJzFWlY87vUWdajWVhT9muzGOuEZCdcKvCQupRyqXOu4qwalcg1ZCnOsVc67U5rpbgZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId8 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token8 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Spielzeug & Baby - mightymerce - Marktplatz
              if (facebookCategory9) {
                FBPageId9 = '1807188706168776';
                FBPermanent_access_token9 = 'EAAX3s7jTXDABAMRl2l1l1XmNclFZCBjwix0BsoEBqc6573fvZA54XdsqWOeB5eg1BTVCG441xiADZAikDmZBN1IXuVpsgGv7tRopEvQ8ZBUQBp4fnXymbSqQaL5CHSEhLs36DMN3v06TUFWoj8nuYr58eaLz3yIUZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId9 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token9 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Essen & Trinken - mightymerce - Marktplatz
              if (facebookCategory10) {
                FBPageId10 = '147333955682422';
                FBPermanent_access_token10 = 'EAAX3s7jTXDABACSpFtCzs7vWjZAENLbh6tf6Qm5OJ5huufZBaxcZBF8zy1cUwmsRFdys4VmvrhgbZC0csbrJBwgPP2ZBJT45sOmS9RnHhSZAoG4hhprNejxQZAOyrcT3eH2GhE7ZCTCK3Pj4hmcV7Nnj39asswULC29wBBRWLZC8N4gZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId10 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token10 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Elektronik & Computer - mightymerce - Marktplatz
              if (facebookCategory11) {
                FBPageId11 = '274440426239639';
                FBPermanent_access_token11 = 'EAAX3s7jTXDABACb8DQNNKPUiyorrtIFbEhBAVgOmocWIwrTewwnoccHyjVoGCJG0gGTYZB4LpT2wR9UZBuOPl53ZAQgzLGAvC0xhfnYUDcYP2aKyH3awwJbZC6JzEZB6gHerWOGpbpOYFlykPkBsIZCIHWYMZBIcmxtPN2xcMUOPAZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId11 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token11 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product');

                console.log('products.client.service - postToWall - Fanpage: xxx - mightymerce - Marktplatz');
              }

              // Fanpage Papier und Handwerk - mightymerce - Marktplatz
              if (facebookCategory12) {
                FBPageId12 = '1580875592210625';
                FBPermanent_access_token12 = 'EAAX3s7jTXDABAGnRbnabBI7cZAzvB7R5H0kppz5XfgTJT44ZBmhDz0hrv0GKqDDpmEertYDMp8LIPrB22ANljWg0Qd1WfbQHEdNu1ba0IUmk390seGZA9VpFHXVsALxzBIb2Ai2FgAwErqclKbtH1PZAwExCQxq3tfPAVJgQUwZDZD';

                $http.post('https://graph.facebook.com/v2.2/' + FBPageId12 +
                    '/feed?' +
                    'access_token=' + FBPermanent_access_token12 +
                    '&callback=FB.__globalCallbacks.f20b3c3c8141f08' +
                    '&client_id=' + FBclient_id +
                    '&client_secret=' + FBclient_secret +
                      //'&description=Einladungskarte%20zur%20Konfirmation%20oder%20Kommunion.%20Die%20Klappkarte%20kann%20selbst%20beschriftet%20werden%20oder%20nach%20Wunsch%20k%C3%B6nnen%20wir%20auch%20gerne%20einen%20Einladungstext%20eindrucken%20-%20was%20dann%200%2C25%20Euro%20pro%20K%C3%A4rtchen%20mehr%20kostet.%20%0A%0AGr%C3%B6%C3%9Fe%20BUY%20NOW' +
                    '&description=' + product.productDescription.substring(0,220) + ' ' + 'BUY NOW' +
                      //'&link=http%3A%2F%2Flocalhost%3A3000%2Fcheckouts%2F56ab49dec096d02740cf94d8%3Fchannel%3Dfacebook' +
                    '&link=' + linkUrl +
                      //'&message=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&method=post' +
                      //'&name=Einladungskarten%20Kommunion%20%C2%AA%C2%A9%20f%C3%BCr%203.60%20EUR' +
                    '&name=' + product.productTitle + ' für ' + product.productPrice + ' ' + response.currencyCode +
                      //'&picture=http%3A%2F%2Flocalhost%3A3000%2Fmodules%2Fproducts%2Fclient%2Fimg%2Fproducts%2Fuploads%2Fproduct-da6f4809.png' +
                    '&picture=' + linkMainImageUrl +
                    '&pretty=0&sdk=joey&type=product').success(function (response) {
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
                        deferred.resolve('Success posting to mightymerce Marketplace - Papier und Handwerk! - Mightymerce Post-Id: ' +response._id);
                      }, function (errorResponse) {
                        console.log('product.client.service - postToWall - save post on MM error: ' + errorResponse);
                        deferred.reject(errorResponse);
                      });
                    })
                    .error(function(msg,code) {
                    });
              }



              /* --- first try to post to fanpage - does not work because of API Version 2.5. Has to be v2.2
              FBFanPage.api('/' + FBPageId + '/feed', 'post', paramsPage, function (response) {
                if (!response || response.error) {
                  console.log('Facebook Error: ' +response.error);
                  console.log('product.client.service - postToWall - error occured post to Fan Facebook');
                  deferred.reject('There was an error creating Facebook post. Please try again!');
                } else {
                  console.log('Success posting to fanpage: ' + FBPageId);
                }
              });
              */



            })
            .error(function(data,status,headers,config){

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

      postToPinterest: function (product, merchantDawanda) {

        console.log('products.client.service - postToPinterest - Start post to Pinterest');
        var deferred = $q.defer();

        var linkUrl;
        if (merchantDawanda) {
          linkUrl = product.productImportURL;
        }
        else {
          if($location.host() === 'localhost'){
            linkUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/'+ product._id + '?channel=pinterest';
          } else {
            linkUrl = $location.protocol() + '://' + $location.host() + '/checkouts/' + product._id + '?channel=pinterest';
          }
        }

        var linkMainImageUrl;
        if (merchantDawanda) {
          linkMainImageUrl = 'http:' + product.productMainImageURLPinterest;
        } else {
          if (product.productImport === 'Dawanda') {
            linkMainImageUrl = 'http:' + product.productMainImageURLPinterest;
          } else {
            if($location.host() === 'localhost'){
              linkMainImageUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + product.productMainImageURLPinterest.substring(1);
            } else {
              linkMainImageUrl = $location.protocol() + '://' + $location.host() + product.productMainImageURLPinterest.substring(1);
            }
          }
        }


        $http.get('/api/currencys/' +product.productCurrency)
          .success(function (response) {
            // this callback will be called asynchronously
            // when the response is available

            var link = linkUrl;
            var image_url = linkMainImageUrl;
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
      postToTwitter: function (product, oauth_AccessToken, oauth_AccessTokenSecret, merchantDawanda) {

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

      instagramPostComment: function(product, user, merchantDawanda) {
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
      // **          Invitation            **
      // **    Pinterest Marketplace       **
      // **                                **
      // ************************************
      //
      //

      sendMarketplaceRequestemail: function sendMarketplaceRequestemail(userDisplayname, usereMail, pinterestCategory1, pinterestCategory2, pinterestCategory3, pinterestCategory4, pinterestCategory5, pinterestCategory6, pinterestCategory7, pinterestCategory8, pinterestCategory9, pinterestCategory10, pinterestCategory11, pinterestCategory12, pinterestUser){
        console.log('orders.client.service - Start sendOrderSubmit');

        var promise = $http.post('/api/auth/sendMarketplaceRequestemail', {
          userDisplayname: userDisplayname,
          usereMail: usereMail,
          pinterestCategory1: pinterestCategory1,
          pinterestCategory2: pinterestCategory2,
          pinterestCategory3: pinterestCategory3,
          pinterestCategory4: pinterestCategory4,
          pinterestCategory5: pinterestCategory5,
          pinterestCategory6: pinterestCategory6,
          pinterestCategory7: pinterestCategory7,
          pinterestCategory8: pinterestCategory8,
          pinterestCategory9: pinterestCategory9,
          pinterestCategory10: pinterestCategory10,
          pinterestCategory11: pinterestCategory11,
          pinterestCategory12: pinterestCategory12,
          pinterestUser: pinterestUser

        }).then(function successCallback(response) {
          console.log('authentication.client.service - sendOrderSubmit - success ');
          return response.data;
        });
        return promise;
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
      },

      dawandaGetSelectedProduct: function(productId) {
        console.log('product.client.service - dawandaGetMyProducts - start');

        var url = '/api/users/dawanda/dawandaGetSelectedProduct/' + productId;
        return $http.get(url).then(function (response) {
          //console.log('product.client.service - dawandaGetSelectedProduct - return value: ' +response.data);
          return response.data;
        });
      }

    };
  }
]);
