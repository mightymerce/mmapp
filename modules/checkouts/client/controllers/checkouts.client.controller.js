'use strict';

// Checkouts controller
angular.module('checkouts').controller('CheckoutsController', ['$window', '$scope', '$stateParams', '$location', '$http', 'Authentication', 'Checkouts', 'ChoutServices', 'PaypalServicesSetExpressCheckout', 'PaypalServicesGetExpressCheckoutDetails', 'Products', 'Users', 'Orders', 'Legals', '$cookieStore',
  function ($window, $scope, $stateParams, $location, $http, Authentication, Checkouts, ChoutServices, PaypalServicesSetExpressCheckout, PaypalServicesGetExpressCheckoutDetails, Products, Users, Orders, Legals, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.totalPrice = '';

    // set the default bootswatch name
    $scope.css = 'modules/checkouts/client/css/style-min.css';

    // Find existing Checkout Product
    $scope.findOne = function () {
      console.log('checkouts.client.controller - findOne - start');

      // Call getSelected Product service
      var searchObject = $stateParams.checkoutId;
      console.log('checkouts.client.controller - findOne - checkoutId: ' +searchObject);

      // Get Product to be checkout out
      ChoutServices.getProduct(searchObject).then(function (Products){
        $scope.product = Products;

        // Get Merchant information for product
        ChoutServices.getUser($scope.product.user._id).then(function (Users){
          $scope.user = Users;
        });

        // Get Delivery option information for product
        ChoutServices.getDelivery($scope.product.productShippingoption).then(function (Delivery){
          $scope.delivery = Delivery;
        });

        // Get Delivery option information for product
        ChoutServices.getLegal($scope.product.user._id).then(function (Legals){
          $scope.legal = Legals;
          $cookieStore.put('user.legals', Legals);
        });

        // ToDo get channel from URL
        $cookieStore.put('order.channel', $location.search().channel);

      });
      console.log('checkouts.client.controller - findOne - end');
    };


    // Create new Checkout
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'checkoutForm');

        return false;
      }

      // Create new Checkout object
      var checkout = new Checkouts({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      checkout.$save(function (response) {
        $location.path('checkouts/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Checkout
    $scope.remove = function (checkout) {
      if (checkout) {
        checkout.$remove();

        for (var i in $scope.checkouts) {
          if ($scope.checkouts[i] === checkout) {
            $scope.checkouts.splice(i, 1);
          }
        }
      } else {
        $scope.checkout.$remove(function () {
          $location.path('checkouts');
        });
      }
    };

    // Update existing Checkout
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'checkoutForm');

        return false;
      }

      var checkout = $scope.checkout;

      checkout.$update(function () {
        $location.path('checkouts/' + checkout._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Checkouts
    $scope.find = function () {
      $scope.checkouts = Checkouts.query();
    };

    // Call Paypal - paypalSetExpressCheckout
    $scope.checkoutPaypal = function () {

      // ToDo get user paypal Details

      console.log('checkouts.client.controller - paypalSetExpressCheckout - start');
      if(!$scope.user.paypalUser || !$scope.user.paypalPwd || !$scope.user.paypalSignature)
      {
        $scope.error = 'The merchant has not provided necessary Paypal information. ';
        console.log('checkouts.client.controller - paypalSetExpressCheckout - error no Merchant Paypal information');
      }
      else
      {
        var returnUrl = $location.protocol() + '://' + $location.host();
        if($location.host() === 'localhost'){
          returnUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/review/review';
        } else {
          returnUrl = $location.protocol() + '://' + $location.host() + '/checkouts/review/review';
        }

        var cancelUrl = $location.protocol() + '://' + $location.host();
        if($location.host() === 'localhost'){
          cancelUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/checkouts/cancel/cancel';
        } else {
          cancelUrl = $location.protocol() + '://' + $location.host() + '/checkouts/cancel/cancel';
        }

        PaypalServicesSetExpressCheckout.query({
          USER: $scope.user.paypalUser,
          PWD: $scope.user.paypalPwd,
          SIGNATURE: $scope.user.paypalSignature,
          returnUrl: returnUrl,
          cancelUrl: cancelUrl,
          brandName: $scope.user.displayName,
          brandLogoUrl: $scope.user.profileImageURL,
          productName: $scope.product.productTitle.substring(0,120),
          productDescription: $scope.product.productDescription.substring(0,120),
          productNo: $scope.product.productId,
          productQuantity: $('.amount').val(),
          cartAmount: $('.lbl-total-PP').val(),
          cartShippingAmount: $('.lbl-shipping-PP').val(),
          productItemAmount: $('.lbl-itemprice-PP').val(),
          cartSubtotalAmount: $('.lbl-subtotal-PP').val(),
          buyerMail: '@',
          productCurrency: 'EUR'
        }, function(data) {
          console.log('checkouts.client.controller - paypalSetExpressCheckout and open Paypal window URL: ' +data.redirectUrl);
          $cookieStore.put('paypal.user.profileImageURL', $scope.user.profileImageURL);
          $cookieStore.put('paypal.product.productMainImageURL', $scope.product.productMainImageURL);
          $cookieStore.put('paypal.product.productId', $scope.product._id);
          $cookieStore.put('paypal.user.displayName', $scope.user.displayName);
          $cookieStore.put('paypal.user.merchantURLText', $scope.user.merchantURLText);
          $cookieStore.put('paypal.user.merchantURL', $scope.user.merchantURL);
          $cookieStore.put('paypal.user.userId', $scope.user._id);
          $cookieStore.put('paypal.product.productTitle', $scope.product.productTitle);
          $cookieStore.put('paypal.product.productDescription', $scope.product.productDescription);
          $cookieStore.put('paypal.product.productPrice', $scope.product.productPrice);
          $cookieStore.put('paypal.delivery.deliveryTitle', $scope.delivery.deliveryTitle);
          $cookieStore.put('paypal.delivery.productPrice', $scope.delivery.deliveryTime);
          $cookieStore.put('paypal.order.vat', $('.lbl-vat-PP').val());
          $cookieStore.put('paypal.order.subtotal', $('.lbl-subtotal-PP').val());

          console.log('checkouts.client.controller - paypalSetExpressCheckout - profileImageURL: ' +$scope.user.profileImageURL);
          $window.open(data.redirectUrl);
        });


      }
    };

    // Call Paypal
    $scope.getPaypalDetails = function () {
      console.log('checkouts.client.controller - getExpressCheckoutDetails - start');
      if($location.search().token)
      {
        console.log('checkouts.client.controller - getExpressDetails route params: ' +$location.search().token);

        // Get Merchant information for product
        ChoutServices.getUser($cookieStore.get('paypal.user.userId')).then(function (Users){
          $scope.user = Users;

          // Get legal option of merchant
          $scope.legal = $cookieStore.get('user.legals');

          console.log('checkouts.client.controller - getExpressDetails - user (Merchant): ' +$scope.user.username);

          PaypalServicesGetExpressCheckoutDetails.query({
            USER: $scope.user.paypalUser,
            PWD: $scope.user.paypalPwd,
            SIGNATURE: $scope.user.paypalSignature,
            token: $location.search().token,
            doPayment: false

          }, function(data) {

            console.log('checkouts.client.controller - getExpressDetails - response data-object: ' +data);

            $scope.paypal = data;
            $scope.paypaltoken = $location.search().token;
            $scope.profileImageURL = $cookieStore.get('paypal.user.profileImageURL');
            $scope.productMainImageURL = $cookieStore.get('paypal.product.productMainImageURL');
            $scope.displayName = $cookieStore.get('paypal.user.displayName');
            $scope.merchantURLText = $cookieStore.get('paypal.user.merchantURLText');
            $scope.productTitle = $cookieStore.get('paypal.product.productTitle');
            $scope.productDescription = $cookieStore.get('paypal.product.productDescription');
            $scope.deliveryTitle = $cookieStore.get('paypal.delivery.deliveryTitle');
            $scope.deliveryTime = $cookieStore.get('paypal.delivery.productPrice');
            $scope.vat = $cookieStore.get('paypal.order.vat');

            console.log(data.PAYMENTREQUEST_0_AMT);

            $('.single-price').text(data.L_PAYMENTREQUEST_0_AMT0);
            $('.lbl-total').text(data.PAYMENTREQUEST_0_AMT);
            $('.lbl-priceperitem').text(data.L_PAYMENTREQUEST_0_AMT0);
            $('.lbl-quantity').text(data.L_PAYMENTREQUEST_0_QTY0);
            $('.amount').text(data.L_PAYMENTREQUEST_0_QTY0);
            $('.lbl-shipping').text(data.PAYMENTREQUEST_0_SHIPPINGAMT);
            $('.lbl-subtotal').text(data.PAYMENTREQUEST_0_ITEMAMT);


            // Put values to store in next step to cookieStore
            $cookieStore.put('paypal.data', data);
            $cookieStore.put('paypal.data.token', $location.search().token);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_NOTETEXT', data.PAYMENTREQUEST_0_NOTETEXT);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_TRANSACTIONID', data.PAYMENTREQUEST_0_TRANSACTIONID);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_INVNUM', data.PAYMENTREQUEST_0_INVNUM);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_HANDLINGAMT', data.PAYMENTREQUEST_0_HANDLINGAMT);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPPINGAMT', data.PAYMENTREQUEST_0_SHIPPINGAMT);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_ITEMAMT', data.PAYMENTREQUEST_0_ITEMAMT);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_CURRENCYCODE', data.PAYMENTREQUEST_0_CURRENCYCODE);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_AMT', data.PAYMENTREQUEST_0_AMT);
            $cookieStore.put('paypal.L_PAYMENTREQUEST_0_QTY0', data.L_PAYMENTREQUEST_0_QTY0);

            // Payer Information
            $cookieStore.put('paypal.EMAIL', data.EMAIL);
            $cookieStore.put('paypal.PAYERID', data.PAYERID);
            $cookieStore.put('paypal.PAYERSTATUS', data.PAYERSTATUS);
            $cookieStore.put('paypal.COUNTRYCODE', data.COUNTRYCODE);
            $cookieStore.put('paypal.FIRSTNAME', data.FIRSTNAME);
            $cookieStore.put('paypal.LASTNAME', data.LASTNAME);


            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTONAME', data.PAYMENTREQUEST_0_SHIPTONAME);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOSTREET', data.PAYMENTREQUEST_0_SHIPTOSTREET);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOCITY', data.PAYMENTREQUEST_0_SHIPTOCITY);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOSTATE', data.PAYMENTREQUEST_0_SHIPTOSTATE);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOZIP', data.PAYMENTREQUEST_0_SHIPTOZIP);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME', data.PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOPHONENUM', data.PAYMENTREQUEST_0_SHIPTOPHONENUM);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_ADDRESSSTATUS', data.PAYMENTREQUEST_0_ADDRESSSTATUS);
            $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPPINGAMT', data.PAYMENTREQUEST_0_SHIPPINGAMT);

          });
        });
      }
      else{
        console.log('checkouts.client.controller - getExpressDetails no token available!');
      }

      /*
      ChoutServices.GetExpressCheckout($location.search().token).then(function(response){
        $scope.paypal = response;

        console.log('checkouts.client.controller - getExpressDetails URL: ' + angular.toJson(response));
      });
      */
    };


    // Call Paypal
    $scope.doPayment = function () {
      console.log('checkouts.client.controller - doPayment - start');
      if($location.search().token)
      {
        console.log('checkouts.client.controller - getExpressDetails route params: ' +$location.search().token);
        PaypalServicesGetExpressCheckoutDetails.query({
          USER: $scope.user.paypalUser,
          PWD: $scope.user.paypalPwd,
          SIGNATURE: $scope.user.paypalSignature,
          token: $location.search().token,
          doPayment: true

        }, function(data) {
          $scope.paypal = data;

          console.log('checkouts.client.controller - doPayment - populate Data on view');

          $scope.profileImageURL = $cookieStore.get('paypal.user.profileImageURL');
          $scope.productMainImageURL = $cookieStore.get('paypal.product.productMainImageURL');
          $scope.displayName = $cookieStore.get('paypal.user.displayName');
          $scope.merchantURLText = $cookieStore.get('paypal.user.merchantURLText');
          $scope.productTitle = $cookieStore.get('paypal.product.productTitle');
          $scope.productDescription = $cookieStore.get('paypal.product.productDescription');

          // Populate hidden fields for later save
          $scope.orderId = data.PAYMENTREQUEST_0_INVNUM;
          $scope.orderDate = data.TIMESTAMP;
          $scope.orderShippingCost = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPPINGAMT');
          $scope.orderChannel = $cookieStore.get('order.channel');
          $scope.orderTransactionID = data.PAYMENTINFO_0_TRANSACTIONID;
          $scope.orderCustomer = $cookieStore.get('paypal.FIRSTNAME') + ' ' + $cookieStore.get('paypal.LASTNAME');
          $scope.orderPaymentStatus = data.PAYMENTINFO_n_PAYMENTSTATUS;  // Todo verify status https://developer.paypal.com/docs/classic/api/merchant/DoExpressCheckoutPayment_API_Operation_NVP/
          $scope.orderPaymentDate = data.PAYMENTINFO_0_ORDERTIME;
          $scope.orderPaymentType = data.PAYMENTINFO_0_PAYMENTTYPE;
          $scope.orderTaxAmount = $cookieStore.get('paypal.order.vat');
          $scope.orderTax = '';
          $scope.ordereMail = $cookieStore.get('paypal.EMAIL');
          $scope.orderPayerID = data.PAYERID;
          $scope.orderPayerStatus = data.PAYERSTATUS;
          $scope.orderPayerFirstName = $cookieStore.get('paypal.FIRSTNAME');
          $scope.orderPayerLastName = $cookieStore.get('paypal.LASTNAME');
          $scope.orderShipToName = data.PAYMENTREQUEST_0_SHIPTONAME;
          $scope.orderShipToStreet = data.PAYMENTREQUEST_0_SHIPTOSTREET;
          $scope.orderShipToCity = data.PAYMENTREQUEST_0_SHIPTOCITY;
          $scope.orderShipToState = data.PAYMENTREQUEST_n_SHIPTOSTATE;
          $scope.orderShipToCntryCode = data.PAYMENTREQUEST_n_SHIPTOCOUNTRYCODE;
          $scope.orderShipToZip = data.PAYMENTREQUEST_0_SHIPTOZIP;
          $scope.orderShipToAdressStatus = ''; //$cookieStore.get('paypal.PAYMENTREQUEST_0_ADDRESSSTATUS');
          $scope.orderShipToTotalAmount = $cookieStore.get('paypal.PAYMENTREQUEST_0_AMT');
          $scope.orderShipToCurrencyCode = $cookieStore.get('paypal.PAYMENTREQUEST_0_CURRENCYCODE');
          $scope.orderShipToSubtotalAmount = $cookieStore.get('paypal.PAYMENTREQUEST_0_ITEMAMT');
          $scope.orderStatus = 'CREATED';
          $scope.orderProductID = $cookieStore.get('paypal.product.productId');
          $scope.orderProductQuantity = $cookieStore.get('paypal.L_PAYMENTREQUEST_0_QTY0');
          $scope.orderTrackingNo = '';
          $scope.ordereMailCustomerShipMessage = '';
          $scope.userId = $cookieStore.get('paypal.user.userId');
          $scope.orderCustomerPayerMessage = $cookieStore.get('paypal.PAYMENTREQUEST_0_NOTETEXT');

          // Put values to store in next step to cookieStore
          /*$cookieStore.put('paypal.data', data);
          $cookieStore.put('paypal.data.token', $location.search().token);

          $cookieStore.put('paypal.PAYMENTREQUEST_0_NOTETEXT', data.PAYMENTREQUEST_0_NOTETEXT);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_TRANSACTIONID', data.PAYMENTREQUEST_0_TRANSACTIONID);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_INVNUM', data.PAYMENTREQUEST_0_INVNUM);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_HANDLINGAMT', data.PAYMENTREQUEST_0_HANDLINGAMT);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPPINGAMT', data.PAYMENTREQUEST_0_SHIPPINGAMT);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_ITEMAMT', data.PAYMENTREQUEST_0_ITEMAMT);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_CURRENCYCODE', data.PAYMENTREQUEST_0_CURRENCYCODE);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_AMT', data.PAYMENTREQUEST_0_AMT);

          // Payer Information
          $cookieStore.put('paypal.EMAIL', data.EMAIL);
          $cookieStore.put('paypal.PAYERID', data.PAYERID);
          $cookieStore.put('paypal.PAYERSTATUS', data.PAYERSTATUS);
          $cookieStore.put('paypal.COUNTRYCODE', data.COUNTRYCODE);

          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTONAME', data.PAYMENTREQUEST_0_SHIPTONAME);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOSTREET', data.PAYMENTREQUEST_0_SHIPTOSTREET);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOCITY', data.PAYMENTREQUEST_0_SHIPTOCITY);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOSTATE', data.PAYMENTREQUEST_0_SHIPTOSTATE);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOZIP', data.PAYMENTREQUEST_0_SHIPTOZIP);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME', data.PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME);
          $cookieStore.put('paypal.PAYMENTREQUEST_0_SHIPTOPHONENUM', data.PAYMENTREQUEST_0_SHIPTOPHONENUM);
          */

          console.log('checkouts.client.controller - doPayment - save data to DB');
          // Save order in Mongose
          // Create new Checkout object
          var order = new Orders({
            orderId: $scope.orderId,
            orderDate: $scope.orderDate,
            orderShippingCost: $scope.orderShippingCost,
            orderChannel: $scope.orderChannel,
            orderTransactionID: $scope.orderTransactionID,
            orderCustomer: $scope.orderCustomer,
            orderPaymentStatus: $scope.orderPaymentStatus,
            orderPaymentDate: $scope.orderPaymentDate,
            orderPaymentType: $scope.orderPaymentType,
            orderTaxAmount: $scope.orderTaxAmount,
            orderTax: $scope.orderTax,
            ordereMail: $scope.ordereMail,
            orderPayerID: $scope.orderPayerID,
            orderPayerStatus: $scope.orderPayerStatus,
            orderPayerFirstName: $scope.orderPayerFirstName,
            orderPayerLastName: $scope.orderPayerLastName,
            orderShipToName: $scope.orderShipToName,
            orderShipToStreet: $scope.orderShipToStreet,
            orderShipToCity: $scope.orderShipToCity,
            orderShipToState: $scope.orderShipToState,
            orderShipToCntryCode: $scope.orderShipToCntryCode,
            orderShipToZip: $scope.orderShipToZip,
            orderShipToAdressStatus: $scope.orderShipToAdressStatus,
            orderShipToTotalAmount: $scope.orderShipToTotalAmount,
            orderShipToCurrencyCode: $scope.orderShipToCurrencyCode,
            orderStatus: $scope.orderStatus,
            orderProductID: $scope.orderProductID,
            orderProductQuantity: $scope.orderProductQuantity,
            orderTrackingNo: $scope.orderTrackingNo,
            ordereMailCustomerShipMessage: $scope.ordereMailCustomerShipMessage,
            user: $scope.userId,
            orderCustomerPayerMessage: $scope.orderCustomerPayerMessage
          });

          // Redirect after save
          order.$save(function (response) {
            console.log('checkouts.client.controller - doPayment - success stored in DB - now redirect');
            $location.path('/checkouts/success/success');

            // Clear form fields
            $scope.userId = '';
            $scope.orderId = '';
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });

        });
      }
      else{
        console.log('checkouts.client.controller - doPayment - no token available!');
      }

      /*
       ChoutServices.GetExpressCheckout($location.search().token).then(function(response){
       $scope.paypal = response;

       console.log('checkouts.client.controller - getExpressDetails URL: ' + angular.toJson(response));
       });
       */
    }; // Call Paypal


    $scope.loadSuccess = function () {
      console.log('checkouts.client.controller - laodSuccess - start');

      $scope.legal = $cookieStore.get('user.legals');

      // Take data from cookieStore
      $scope.paypal = $cookieStore.get('paypal.data');

      $scope.profileImageURL = $cookieStore.get('paypal.user.profileImageURL');
      $scope.productMainImageURL = $cookieStore.get('paypal.product.productMainImageURL');
      $scope.displayName = $cookieStore.get('paypal.user.displayName');
      $scope.merchantURLText = $cookieStore.get('paypal.user.merchantURLText');
      $scope.productTitle = $cookieStore.get('paypal.product.productTitle');
      $scope.productDescription = $cookieStore.get('paypal.product.productDescription');
      $scope.PAYMENTREQUEST_0_INVNUM = $cookieStore.get('paypal.PAYMENTREQUEST_0_INVNUM');

      $scope.PAYMENTREQUEST_0_HANDLINGAMT = $cookieStore.get('paypal.PAYMENTREQUEST_0_HANDLINGAMT');
      $scope.PAYMENTREQUEST_0_SHIPPINGAMT = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPPINGAMT');
      $scope.PAYMENTREQUEST_0_ITEMAMT = $cookieStore.get('paypal.PAYMENTREQUEST_0_ITEMAMT');
      $scope.PAYMENTREQUEST_0_CURRENCYCODE = $cookieStore.get('paypal.PAYMENTREQUEST_0_CURRENCYCODE');
      $scope.PAYMENTREQUEST_0_AMT = $cookieStore.get('paypal.PAYMENTREQUEST_0_AMT');
      $scope.L_PAYMENTREQUEST_0_QTY0 = $cookieStore.get('paypal.L_PAYMENTREQUEST_0_QTY0');

      // Payer Information
      $scope.ordereMAIL = $cookieStore.get('paypal.EMAIL');
      $scope.vat = $cookieStore.get('paypal.order.vat');
      $scope.subtotal = $cookieStore.get('paypal.order.subtotal');

      $scope.PAYMENTREQUEST_0_SHIPTONAME = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTONAME');
      $scope.PAYMENTREQUEST_0_SHIPTOSTREET = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTOSTREET');
      $scope.PAYMENTREQUEST_0_SHIPTOCITY = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTOCITY');
      $scope.PAYMENTREQUEST_0_SHIPTOSTATE = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTOSTATE');
      $scope.PAYMENTREQUEST_0_SHIPTOZIP = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTOZIP');
      $scope.PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTOCOUNTRYNAME');
      $scope.PAYMENTREQUEST_0_SHIPTOPHONENUM = $cookieStore.get('paypal.PAYMENTREQUEST_0_SHIPTOPHONENUM');

    };






    /*// TODO: Put your PayPal settings here:
    var returnUrl = 'http://localhost:3001/paypal/success';
    var cancelUrl = 'http://localhost:3001/paypal/cancel/cancel';

    /!**
     * React to pay POST. This will create paypal pay url and redirect user there.
     * @param  {[type]} req  [description]
     * @param  {[type]} res) {}          [description]
     * @return {[type]}      [description]
     *!/
      // Paypal Checkout
    $scope.pay = function (req, res) {
      console.log('Start paypal - pay function');
      // create paypal object in sandbox mode. If you want non-sandbox remove tha last param.
      var paypal = PayPal.create('wagner+2@mightymerce.com', process.env.API_PASSWORD, process.env.SIGNATURE, true);
      console.log('scope.pay: ' +paypal);
      paypal.setPayOptions('ACME Soft', null, process.env.logoImage, '00ff00', 'eeeeee');

      paypal.setProducts([{
        name: 'ACME Drill',
        description: 'Amazing drill',
        quantity: 1,
        amount: 100.99
      }]);

      // Invoice must be unique.
      var invoice = uuid.v4();
      paypal.setExpressCheckoutPayment(
          'test@email.com',
          invoice,
          100.99,
          'This is really amazing product you are getting',
          'USD',
          returnUrl,
          cancelUrl,
          false,
          function(err, data) {
            if (err) {
              console.log(err);
              res.status(500).send(err);
              return;
            }

            // Regular paid.
            res.redirect(data.redirectUrl);
          });
        };


    $scope.paypalcancel = function (req, res) {
      // Cancel payment.
      res.send('Payment canceled');
    };

    $scope.paypalsuccess = function (req, res) {
      var paypal = PayPal.create(process.env.API_USERNAME, process.env.API_PASSWORD, process.env.SIGNATURE, true);
      paypal.getExpressCheckoutDetails(req.query.token, true, function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
          return;
        }
      });

      // Check token and details.
      var resObj = JSON.stringify(data);
      res.send('Successfuly payment, ' + resObj);
    };

    // catch 404 and forwarding to error handler
    $scope.use = function (req, res) {
      res.status(404).send('Unknown page');
    };*/
  }
]);



