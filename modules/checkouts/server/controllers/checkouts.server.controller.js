'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Checkout = mongoose.model('Checkout'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var express = require('express');
var app = express();
var uuid = require('node-uuid');
var PayPal = require('../../../../index');

// TODO: Put your PayPal settings here:
var returnUrl = 'http://localhost:3000/checkouts/review/review';
var cancelUrl = 'http://localhost:3000/checkouts/cancel/cancel';

/**
 * Create a checkout
 */
exports.create = function (req, res) {
  var checkout = new Checkout(req.body);
  checkout.user = req.user;

  checkout.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkout);
    }
  });
};

/**
 * Show the current checkout
 */
exports.read = function (req, res) {
  res.json(req.checkout);
};

/**
 * Update a checkout
 */
exports.update = function (req, res) {
  var checkout = req.checkout;

  checkout.title = req.body.title;
  checkout.content = req.body.content;

  checkout.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkout);
    }
  });
};

/**
 * Delete an checkout
 */
exports.delete = function (req, res) {
  var checkout = req.checkout;

  checkout.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkout);
    }
  });
};

/**
 * List of Checkouts
 */
exports.list = function (req, res) {
  Checkout.find().sort('-created').populate('user', 'displayName').exec(function (err, checkouts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(checkouts);
    }
  });
};

/**
 * Checkout middleware
 */
exports.checkoutByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Checkout is invalid'
    });
  }

  Checkout.findById(id).populate('user', 'displayName').exec(function (err, checkout) {
    if (err) {
      return next(err);
    } else if (!checkout) {
      return res.status(404).send({
        message: 'No checkout with that identifier has been found'
      });
    }
    req.checkout = checkout;
    next();
  });
};


/**
 * React to pay POST. This will create paypal pay url and redirect user there.
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {}          [description]
 * @return {[type]}      [description]
 */
exports.paypalSetExpressCheckout = function (req, res) {
  console.log('checkout.server.controller - paypalSetExpressCheckout - start ');

  // create paypal object in sandbox mode. If you want non-sandbox remove tha last param.
  var paypal = PayPal.create(req.params.USER, req.params.PWD, req.params.SIGNATURE, true);
  paypal.setPayOptions(req.params.brandName, null, req.params.brandLogoUrl, '00ff00', 'eeeeee', 0, 2, 1);

  console.log('checkout.server.controller - paypalSetExpressCheckout - setProducts');

  paypal.setProducts([{
    name: req.params.productName,
    description: req.params.productDescription,
    quantity: req.params.productQuantity,
    amount: req.params.productItemAmount,
    no: req.params.productNo,
    category: 'Physical'
  }]);

  console.log('checkout.server.controller - paypalSetExpressCheckout - productDescription: ' +req.params.productDescription);

  // Invoice must be unique.
  var invoice = uuid.v4();
  paypal.setExpressCheckoutPayment(
      req.params.buyerMail,
      invoice,
      req.params.cartAmount,
      req.params.productDescription,
      req.params.productCurrency,
      req.params.cartShippingAmount,
      req.params.productItemAmount,
      req.params.cartSubtotalAmount,
      req.params.returnUrl,
      req.params.cancelUrl,
      false,
      function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
          return;
        }

        console.log('checkout.server.controller - paypalSetExpressCheckout - return value: ' +data.redirectUrl);

        res.json({ redirectUrl: data.redirectUrl });
        //res.send(data.redirectUrl);

      });
};

exports.paypalGetExpressCheckoutDetails = function (req, res) {
  console.log('checkout.server.controller - paypalGetExpressCheckoutDetails - start');

  var paypal = PayPal.create(req.params.USER, req.params.PWD, req.params.SIGNATURE, true);
  console.log('checkout.server.controller - paypalGetExpressCheckoutDetails - doPayment: ' +req.params.doPayment);
  paypal.getExpressCheckoutDetails(req.params.token, req.params.doPayment, function(err, data) {
    if (err) {
      console.log('checkout.server.controller - paypalGetExpressCheckoutDetails - doPayment - ERROR: ' +err.L_LONGMESSAGE0);
      res.status(500).send(err);
      return;
    }

    // Check token and details.
    var resObj = JSON.stringify(data);
    res.send(data);
  });
};
