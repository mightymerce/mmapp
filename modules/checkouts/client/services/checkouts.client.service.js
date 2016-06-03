'use strict';

//Checkouts service used for communicating with the checkouts REST endpoints
angular.module('checkouts').factory('Checkouts', ['$resource',

  function ($resource) {
    return $resource('api/checkouts/:checkoutId', {
      checkoutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);


angular.module('checkouts').factory('PaypalServicesSetExpressCheckout', ['$resource',
  function($resource) {
    return $resource('api/paypal/paypalSetExpressCheckout/:USER/:PWD/:SIGNATURE/:returnUrl/:cancelUrl/:brandName/:brandLogoUrl/:productName/:productDescription/:productQuantity/:cartAmount/:buyerMail/:productCurrency/:cartShippingAmount/:productItemAmount/:productNo/:cartSubtotalAmount', {
      USER: '',
      PWD: '',
      SIGNATURE: '',
      returnUrl: '',
      cancelUrl: '',
      brandName: '',
      brandLogoUrl: '',
      productName: '',
      productDescription: '',
      productQuantity: null,
      cartAmount: null,
      buyerMail: '',
      productCurrency: '',
      cartShippingAmount: '',
      productNo: '',
      productItemAmount: '',
      cartSubtotalAmount: ''

    }, {
      query: { method: 'GET', isArray: false }
    });
  }
]);

angular.module('checkouts').factory('CreateOrder', ['$resource',
  function($resource) {
    return $resource('api/paypal/paypalGetExpressCheckoutDetails/:USER/:PWD/:SIGNATURE/:token/:doPayment', {
      USER: '',
      PWD: '',
      SIGNATURE: '',
      token: '',
      doPayment: ''
    }, {
      update: 'POST'
    });
  }
]);

angular.module('checkouts').factory('PaypalServicesGetExpressCheckoutDetails', ['$resource',
  function($resource) {
    return $resource('api/paypal/paypalGetExpressCheckoutDetails/:USER/:PWD/:SIGNATURE/:token/:doPayment', {
      USER: '',
      PWD: '',
      SIGNATURE: '',
      token: '',
      doPayment: ''
    }, {
      query: { method: 'GET', isArray: false }
    });
  }
]);


//Service to retrieve selected product
angular.module('checkouts').factory('ChoutServices', ['$http', '$q',
  function ($http, $q) {
    return {
      getProduct: function getProduct(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/products/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetProduct');
          // The return value gets picked up by the then in the controller.

          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getCurrency: function getCurrency(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/currencys/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetCurrency - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getUser: function getUser(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/users/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetUser - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getDelivery: function getDelivery(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/deliverys/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetDelivery - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getTax: function getTax(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/taxes/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetTax - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getLegal: function getLegal(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/legals?user=' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetLegal - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      SetExpressCheckout: function paypalSetExpressCheckout(){
        console.log('checkouts.client.service - Start SetExpressCheckout');
        var promise = $http({
          method: 'POST',
          url: '/api/paypal/paypalSetExpressCheckout/:user',
          params: {
            user: 'wagner.register-facilitator_api1.gmail.com',
            //pwd: 'AQD3E5YDDJQTTKZY',
            //signature: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AZvdFN63c7Cux1WXVX5I8hp8.YIs'
            amount: '102',
            //currency: 'USD',
            //email: 'test@email.com',
            productTitle: 'nice',
            productDescription: 'supershoe'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - SetExpressCheckout - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log('checkouts.client.service.js - SetExpressCheckout - Success ' +response.data.error);
          response.status(500).send(response.data.error);
          return response.data;
        });
        return promise;
      },

      sendmail: function sendmail(data){
        console.log('checkouts.client.service - Start Send eMail ' +data.orderId);

        $http.post('/api/sendmail', {
          orderId: data.orderId,
          orderDate: data.orderDate,
          orderChannel: data.orderChannel,
          orderSellereMail: data.useremail,

          // Seller information
          orderSellerProfileImageURL: data.profileImageURL,
          orderSellerProfileDisplayName: data.displayName,

          // Customer
          orderCustomer: data.orderCustomer,
          ordereMail: data.ordereMail,

          orderShipToName: data.orderShipToName,
          orderShipToStreet: data.orderShipToStreet,
          orderShipToCity: data.orderShipToCity,
          orderShipToState: data.orderShipToState,
          orderShipToCntryCode: data.orderShipToCntryCode,
          orderShipToZip: data.orderShipToZip,

          // Price information
          orderShippingCost: data.orderShippingCost,
          orderShippingTime: data.orderShippingTime,
          orderShipToTotalAmount: data.orderShipToTotalAmount,
          orderShipToSubtotalAmount: data.orderShipToSubtotalAmount,
          orderShipToCurrencyCode: data.orderShipToCurrencyCode,
          orderTaxAmount: data.orderTaxAmount,
          orderProductQuantity: data.orderProductQuantity,

          // Product information
          orderProductMainImageURL: data.productMainImageURL,
          orderProductTitle: data.productTitle,
          orderProductDescription: data.productDescription.substring(0,180),
          orderProductPrice: data.orderProductPrice,

          // Legal information
          orderLegalImprint: data.legal.legalImprint,
          orderLegalTermsandConditions: data.legal.legalTermsandConditions,
          orderLegalReturnPolicy: data.legal.legalReturnPolicy


        }).success(function(data, status, headers, config) {
          if(data.success){
            //
          }else {
            //do something about the error
          }
        });

      },

      GetExpressCheckout: function GetExpressCheckout(token, debug, doPayment, data){

        var promise = $http({
          method: 'POST',
          url: '/api/paypal/paypalGetExpressCheckoutDetails',
          //redirect: 'https://' + (debug ? 'www.sandbox.paypal.com/cgi-bin/webscr' : 'www.paypal.com/cgi-bin/webscr'),
          params: {
            USER: 'wagner.register-facilitator_api1.gmail.com',
            PWD: 'AQD3E5YDDJQTTKZY',
            SIGNATURE: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AZvdFN63c7Cux1WXVX5I8hp8.YIs',
            VERSION: '119.0',
            TOKEN: token,
            METHOD: 'GetExpressCheckoutDetails'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('checkouts.client.service.js - GetExpressCheckout - Success');
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log('checkouts.client.service.js - GetExpressCheckout - Success ' +response.data.error);
          response.status(500).send(response.data.error);
          return response.data;
        });
        return promise;

      }

    };
  }
]);
