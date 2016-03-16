'use strict';

// Orders controller
angular.module('orders')
    .controller('OrdersController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Products', '$uibModal', '$http', 'Orders', 'OrdersServices', 'OrdersUpdateServices',
  function ($scope, $state, $stateParams, $location, Authentication, Products, $uibModal, $http, Orders, OrdersServices, OrdersUpdateServices) {
    $scope.authentication = Authentication;

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
      $scope.error = null;

      console.log('orders.client.controller - update - start updating order');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'orderForm');
        return false;
      }

      var order = new Orders({
      });

      order._id = $scope.order._id;

      // Order values to be updated
      $scope.orderStatus = 'SHIPPED';
      order.orderStatus = 'SHIPPED';
      order.orderTrackingNo = $scope.orderTrackingNo;
      order.ordereMailCustomerShipMessage = $scope.ordereMailCustomerShipMessage;

      order.$update(function () {
        console.log('orders.client.controller - update - start updating order - success MM DB update');
        OrdersServices.sendOrderSubmit($scope.authentication.user.displayName, order, $scope.orderTrackingNo, $scope.ordereMailCustomerShipMessage).then(function (response) {
          if(response === 'success')
          {
            $scope.success = 'Your order has been updated to shipped and an eMail was sent to your customer.';

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

      // If user is signed in then redirect back home
      if (!$scope.authentication.user) {
        // And redirect to the previous or home page
        $state.go('home', $state.previous.params);
      }
      else {
        $scope.orders = Orders.query({
          'user': $scope.authentication.user._id
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
    $scope.shipOrder = function() {
      OrdersServices.updateOrder($scope.order);

      // ToDo - send email in case Textfield is filled

      console.log('orders.client.controller - shipOrder - success');
      $scope.modalInstance.$dismiss();
      $scope.success = 'Your order has been updated to shipped and an eMail was sent to your customer.';
    };

    $scope.cancelModal = function () {
      $scope.modalInstance.$dismiss();
    };

  }
]);
