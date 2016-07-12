'use strict';

//Orders service used for communicating with the orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
  function ($resource) {
    return $resource('api/orders/:orderId', {
      orderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//Service to retrieve products per order
angular.module('orders').factory('OrdersServices',
  function ($http) {
    return {
      getProducts: function getProducts(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/products/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getOrder: function getOrder(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/orders/' +id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          // The return value gets picked up by the then in the controller.
          console.log('Get Order - Order ID: ' + id);
          console.log('Get Order with Id: ' + response.data);
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getOrders: function getOrders(id) {
        var promise = $http({
          method: 'GET',
          url: '/api/orders/:user',
          params: {
            'user': id
          }
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      getOpenOrders: function getOrders(id) {
        console.log('orders.client.service - getOpenOrders - start - UserId: ' +id);
        var promise = $http({
          method: 'GET',
          url: '/api/orders',
          params: {
            //'user.': id
            'orderStatus': 'CREATED'
          }
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      cancelOrder: function getOrder(order) {
        var promise = $http({
          method: 'PUT',
          url: 'api/orders/' +order._id
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log('Order Status after update to cancel:' +order.orderStatus);
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },
      updateOrder: function updateOrder(id,order) {
        var promise = $http({
          method: 'PUT',
          url: 'api/orders/' +id,
          params: {
            orderStatus: order.orderStatus
            //ordereMailCustomerShipMessage: order.ordereMailCustomerShipMessage,
            //orderTrackingNo: order.orderTrackingNo
          }
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          // The return value gets picked up by the then in the controller.
          return response.data;
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
        return promise;
      },

      sendOrderSubmit: function sendOrderSubmit(userDisplayname, order, orderDHLID, ordereMailCustomerShipMessage){
        console.log('orders.client.service - Start sendOrderSubmit');

        var promise = $http.post('/api/auth/sendordersubmit', {
          userDisplayName: userDisplayname,
          ordereMail: order.ordereMail,
          //ordereMail: order.ordereMail,
          orderName: order.orderPayerFirstName + ' ' + order.orderPayerLastName,
          orderStreet: order.orderShipToStreet,
          orderStreetNo: '',
          orderZIP: order.orderShipToZip,
          orderCity: order.orderShipToCity,
          orderDHLID: orderDHLID,
          ordereMailCustomerShipMessage: ordereMailCustomerShipMessage

        }).then(function successCallback(response) {
          console.log('authentication.client.service - sendOrderSubmit - success ');
          return response.data;
        });
        return promise;
      },

      getCarriers: function getCarriers(){
        console.log('orders.client.service - Start getCarriers');

        var promise = $http.get('/api/orders/shipcloud/getCarriers', {

        }).then(function successCallback(response) {
          console.log('authentication.client.service - getCarriers - success ');
          return response;
        });
        return promise;
      },

      createShipment: function createShipment(shipment){
        console.log('orders.client.service - Start createShipment');

        var promise = $http.post('/api/orders/shipcloud/createShipment', {
          data: shipment,
          headers: {'Content-Type': 'application/json; charset=utf-8'}

        }).then(function successCallback(response) {
          console.log('authentication.client.service - createShipment - success ');
          return response;
        });
        return promise;
      }

    };
  }
);

angular.module('orders').factory('OrdersUpdateServices',
  function ($resource, $http) {
    return {
      UpdateData: function UpdateData(id,orderStatus) {
      /*/!*var data = $.param({
      orderStatus: orderStatus
      });*!/

      $http.put('api/orders/' +id + '?'+ data)
        .success(function (data, status, headers) {
          console.log('OrderId Success: ' + id);
          console.log('OrderId Success: ' + data);
        })
        .error(function (data, status, header, config) {

        });*/
      }
    };
  }
);

