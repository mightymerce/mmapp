'use strict';

// Orders controller
angular.module('orders')
    .controller('OrdersController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Products', 'Users', '$uibModal', '$http', 'Orders', 'OrdersServices', 'OrdersUpdateServices',
  function ($scope, $state, $stateParams, $location, Authentication, Products, Users, $uibModal, $http, Orders, OrdersServices, OrdersUpdateServices) {
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) {
      // And redirect to the previous or home page
      $state.go('home', $state.previous.params);
    }

    // MODAL CANCEL ORDER
    $scope.modalcancelOrder = function (size, selectedOrder) {
      console.log('orders.client.controller - open modalcancelOrder');

      var modalInstance = $uibModal.open({

        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/orders/client/views/cancel-order.modal.view.html',
        controller: function ($scope, order) {
          $scope.order = order;

        },
        size: size,
        resolve: {
          order: function () {
            return selectedOrder;
          }
        },
        scope: $scope
      });
    };

    // MODAL SHIP ORDER
    $scope.modalshipOrder = function (size, selectedOrder) {
      console.log('modalshipOrder');

      $scope.modalInstance = $uibModal.open({

        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/orders/client/views/ship-order.modal.view.html',
        controller: function ($scope, order) {
          $scope.authentication = Authentication;
          $scope.user = Authentication.user;
          $scope.order = order;
          console.log('orders.client.controller - open modalcancelOrder - before call service');
          OrdersServices.getCarriers().then(function (Carriers) {
            console.log('orders.client.controller - open modalcancelOrder - carriers returned: ' +Carriers);
            $scope.carriers = Carriers.data;
          });

        },
        size: size,
        resolve: {
          order: function () {
            return selectedOrder;
          }
        }
      });
    };

    // MODAL RETURN ORDER
    $scope.modalreturnOrder = function (size, selectedOrder) {
      console.log('orders.client.controller - modalreturnOrder');

      var modalInstance = $uibModal.open({

        //animation: $scope.animationsEnabled,
        templateUrl: 'modules/orders/client/views/receive-return-order.modal.view.html',
        controller: function ($scope, order) {
          $scope.order = order;
        },
        size: size,
        resolve: {
          order: function () {
            return selectedOrder;
          }
        }
      });
    };

    // Create new Order
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'orderForm');

        return false;
      }

      // Create new Order object
      var order = new Orders({
        orderId: this.orderId,
        orderDate: this.orderDate,
        orderCustomer: this.orderCustomer,
        orderPayment: this.orderPayment,
        orderPaymentType: this.orderPaymentType,
        orderStatus: this.orderStatus,
        orderShippingCost: this.orderShippingCost,
        orderChannel: this.orderChannel,
        orderTransactionID: this.orderTransactionID,
        orderPaymentStatus: this.orderPaymentStatus,
        orderPaymentDate: this.orderPaymentDate,
        orderTaxAmount: this.orderTaxAmount,
        orderTax: this.orderTax,
        ordereMail: this.ordereMail,
        orderPayerID: this.orderPayerID,
        orderPayerStatus: this.orderPayerStatus,
        orderPayerFirstName: this.orderPayerFirstName,
        orderPayerLastName: this.orderPayerLastName,
        orderShipToName: this.orderShipToName,
        orderShipToStreet: this.orderShipToStreet,
        orderShipToCity: this.orderShipToCity,
        orderShipToState: this.orderShipToState,
        orderShipToCntryCode: this.orderShipToCntryCode,
        orderShipToZip: this.orderShipToZip,
        orderShipToAdressStatus: this.orderShipToAdressStatus,
        orderShipToTotalAmount: this.orderShipToTotalAmount,
        orderShipToCurrencyCode: this.orderShipToCurrencyCode,
        orderProductID: this.orderProductID,
        orderProductQuantity: this.orderProductQuantity,
        orderTrackingNo: this.orderTrackingNo,
        ordereMailCustomerShipMessage: this.ordereMailCustomerShipMessage
      });

      // Redirect after save
      order.$save(function (response) {
        $location.path('orders/' + response._id);

        // Clear form fields
        $scope.orderId = '';
        $scope.orderDate = '';
        $scope.orderCustomer = '';
        $scope.orderPayment = '';
        $scope.orderStatus = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Order
    $scope.remove = function (order) {
      if (order) {
        order.remove();

        for (var i in $scope.orders) {
          if ($scope.orders[i] === order) {
            $scope.orders.splice(i, 1);
          }
        }
      } else {
        $scope.order.remove(function () {
          $location.path('orders');
        });
      }
    };

    // Shipped Order
    $scope.update = function (isValid) {

    };


    // Find a specific Order and its details
    $scope.findOne = function () {

      // If user is signed in then redirect back home
      if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      }

      //$scope.orders = Orders.query();
      console.log('orders.client.controller - findOne - selected orderId: ' +$stateParams.orderId);

      OrdersServices.getOrder($stateParams.orderId).then(function (Orders) {
        if (Orders.userId === $scope.authentication.user.userId)
        {
          OrdersServices.getProducts(Orders.orderProductID).then(function (Products) {
            $scope.order = Orders;
            $scope.product = Products;
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }
        else {
          // And redirect to the previous or home page
          $state.go('home', $state.previous.params);
        }
      });
    };

    // Find existing Order for logged in User
    $scope.find = function () {

      $scope.orderShipped = [];
      $scope.orderReturned = [];
      $scope.orderCreated = [];

      // If user is signed in then redirect back home
      if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      }
      else {
        Orders.query({
          'user': $scope.authentication.user._id
        }, function(orders) {
          $scope.orders = orders;

          angular.forEach(orders,function(value,index){
            if (value.orderStatus === 'CREATED'){
              $scope.orderCreated.push(value);
            }
            if (value.orderStatus === 'SHIPPED'){
              $scope.orderShipped.push(value);
            }
            if (value.orderStatus === 'RETURNED'){
              $scope.orderReturned.push(value);
            }
          });
        });
      }
    };

    // Cancel order -> update Status to Canceled
    $scope.cancelOrder = function() {
      console.log('orders.client.controller - cancelOrder - start');
      $scope.order.orderStatus = 'CANCELLED';

      $http.put('api/orders/' + $scope.order._id, $scope.order).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log('orders.client.controller - cancelOrder - order update api');
        // The return value gets picked up by the then in the controller.
        return response.data;
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      // ToDo - send email in case Textfield is filled

      console.log('orders.client.controller - cancelOrder - end');
    };

    // Ship order -> update Status, TrackingID and send customer message
    $scope.shipOrder = function(isValid) {
      console.log('orders.client.controller - shipOrder - start');

      // Update user if API_Key not yet available
      if (!$scope.authentication.user.shipCloudAPI_Key) {
        var user = new Users({
        });

        user.shipCloudAPI_Key = $scope.user.shipCloudAPI_Key;
        user.$update(function () {

          var shipment = JSON.stringify('{"from": ' +
              '{"company": ' + $scope.authentication.user.displayName + ',' +
              '"first_name": ' + $scope.authentication.user.firstName + ',' +
              '"last_name": ' + $scope.authentication.user.lastName + ',' +
              '"street": ' + $scope.authentication.user.street + ',' +
              '"street_no": ' + $scope.authentication.user.streetno + ',' +
              '"city": ' + $scope.authentication.user.city + ',' +
              '"zip_code": ' + $scope.authentication.user.zipcode + ',' +
              '"country": "DE"' +
              '},' +
              '"to": {' +
              '"company": "",' +
              '"first_name": "",' +
              '"last_name": $scope.order.orderShipToName,' +
              '"street": $scope.order.orderShipToStreet,' +
              '"street_no": "",' +
              '"city": $scope.order.orderShipToCity,' +
              '"zip_code": $scope.order.orderShipToZip,' +
              '"country": $scope.order.orderShipToCntryCode' +
              '},' +
              '"package": {' +
              '"weight": $scope.parcelWeight,' +
              '"length": $scope.parcelLength,' +
              '"width": $scope.parcelWidth,' +
              '"height": $scope.parcelHight' +
              '},' +
              '"carrier": $scope.parcelService,' +
              '"service": "standard",' +
              '"reference_number": $scope.orderId,' +
              '"notification_email": $scope.ordereMail,' +
              '"create_shipping_label": true' +
              '}');

          console.log('orders.client.controller - shipOrder - shipment: ' +shipment);

          OrdersServices.createShipment(shipment).then(function (response) {
            $scope.error = null;

            console.log('orders.client.controller - update - start updating order');

            var order = new Orders({
            });

            order._id = $scope.order._id;

            // Order values to be updated
            $scope.orderStatus = 'SHIPPED';
            order.orderStatus = 'SHIPPED';
            order.orderTrackingNo = $scope.orderTrackingNo;
            order.ordereMailCustomerShipMessage = $scope.ordereMailCustomerShipMessage;
            order.orderShipCloudcarrier = $scope.parcelService;
            if(response.carrier_label_url){order.orderShipCloudcarrier_label_url = response.carrier_label_url;}
            if(response.carrier_tracking_no){order.orderShipCloudcarrier_tracking_no = response.carrier_tracking_no;}
            if(response.carrier_tracking_url){order.orderShipCloudcarrier_tracking_url = response.carrier_tracking_url;}
            if(response.id){order.orderShipCloudid = response.id;}
            if(response.price){order.orderShipCloudprice = response.price;}

            order.$update(function () {
              console.log('orders.client.controller - update - start updating order - success MM DB update');
              OrdersServices.sendOrderSubmit($scope.authentication.user.displayName, order, $scope.orderTrackingNo, $scope.ordereMailCustomerShipMessage).then(function (response) {
                if(response === 'success')
                {
                  $scope.success = 'Your order has been updated to shipped and an eMail was sent to your customer. You will find your shipping label here: ' +response.label_url;

                  $scope.orderStatus = 'SHIPPED';
                  console.log('orders.client.controller - update - end updating order - success');
                }
                else {
                  $scope.error = 'There was an error informing your customer via eMail. PLease contact your customer individualy.';
                }
              });
            }, function (errorResponse) {
              $scope.orderStatus = 'CREATED';
              $scope.error = errorResponse.data.message;
            });
          });
          console.log('orders.client.controller - shipOrder - success');

        }, function (errorResponse) {

        });
      } else {

        var shipment = '{"from": ' +
            '{"company": "' + $scope.authentication.user.displayName + '",' +
            '"first_name": "' + $scope.authentication.user.firstName + '",' +
            '"last_name": "' + $scope.authentication.user.lastName + '",' +
            '"street": "' + $scope.authentication.user.street + '",' +
            '"street_no": "' + $scope.authentication.user.streetno + '",' +
            '"city": "' + $scope.authentication.user.city + '",' +
            '"zip_code": "' + $scope.authentication.user.zipcode + '",' +
            '"country": "DE"' +
            '},' +
            '"to": {' +
            '"company": "' + $scope.order.orderShipToName + '",' +
            '"first_name": "' + $scope.order.orderShipToName + '",' +
            '"last_name": "' + $scope.order.orderShipToName + '",' +
            '"street": "' + $scope.order.orderShipToStreet + ',' +
            '"street_no": "",' +
            '"city": "' + $scope.order.orderShipToCity + '",' +
            '"zip_code": "' + $scope.order.orderShipToZip + '",' +
            '"country": "' + $scope.order.orderShipToCntryCode + '"' +
            '},' +
            '"package": {' +
            '"weight": ' + $scope.parcelWeight + ',' +
            '"length": ' + $scope.parcelLength + ',' +
            '"width": ' + $scope.parcelWidth + ',' +
            '"height": ' + $scope.parcelHight + '' +
            '},' +
            '"carrier": "' + $scope.parcelService + '",' +
            '"service": "standard",' +
            '"reference_number": "' + $scope.orderId  + '",' +
            '"notification_email": "' + $scope.ordereMail + '",' +
            '"create_shipping_label": true' +
            '}';

        OrdersServices.createShipment(shipment).then(function (response) {
          $scope.error = null;

          console.log('orders.client.controller - update - start updating order');

          var order = new Orders({
          });

          order._id = $scope.order._id;

          // Order values to be updated
          $scope.orderStatus = 'SHIPPED';
          order.orderStatus = 'SHIPPED';
          order.ordereMailCustomerShipMessage = $scope.ordereMailCustomerShipMessage;
          order.orderShipCloudcarrier = $scope.parcelService;
          if(response.label_url){order.orderShipCloudcarrier_label_url = response.label_url;}
          if(response.carrier_tracking_no){order.orderShipCloudcarrier_tracking_no = response.carrier_tracking_no;}
          if(response.tracking_url){order.orderShipCloudcarrier_tracking_url = response.tracking_url;}
          if(response.id){order.orderShipCloudid = response.id;}
          if(response.price){order.orderShipCloudprice = response.price;}

          order.$update(function () {
            console.log('orders.client.controller - update - start updating order - success MM DB update');
            OrdersServices.sendOrderSubmit($scope.authentication.user.displayName, order, $scope.orderTrackingNo, $scope.ordereMailCustomerShipMessage).then(function (response) {
              if(response === 'success')
              {
                $scope.success = 'Your order has been updated to shipped and an eMail was sent to your customer. You will find your shipping label here: ' +response.label_url;

                $scope.orderStatus = 'SHIPPED';
                console.log('orders.client.controller - update - end updating order - success');
              }
              else {
                $scope.error = 'There was an error informing your customer via eMail. PLease contact your customer individualy.';
              }
            });
          }, function (errorResponse) {
            $scope.orderStatus = 'CREATED';
            $scope.error = errorResponse.data.message;
          });
        });
        console.log('orders.client.controller - shipOrder - success');
      }
    };

    $scope.cancelModal = function () {
      $scope.modalInstance.$dismiss();
    };

  }
]);
