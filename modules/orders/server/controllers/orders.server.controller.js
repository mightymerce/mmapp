'use strict';

var nodemailer = require('nodemailer');

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a order
 */
exports.create = function (req, res) {
  var order = new Order(req.body);
  //order.user = req.user;
  console.log('Create order - server call! ');

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};


/**
 * Show the current order
 */
exports.read = function (req, res) {
  res.json(req.order);
};

/**
 * Update a order
 */
exports.update = function (req, res) {
  var order = req.order;

  console.log('Update order - server call!');

  order.orderTrackingNo = req.body.orderTrackingNo;
  order.ordereMailCustomerShipMessage = req.body.ordereMailCustomerShipMessage;
  order.orderStatus = req.body.orderStatus;

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * Delete an order
 */
exports.delete = function (req, res) {
  var order = req.order;

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function (req, res) {
  Order.find({ user: { $eq: req.query.user } }).sort('-created').populate('user', 'displayName').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};


/**
 * shipcloud - createShipment
 */
exports.createShipment = function (req, res) {
  console.log('orders.server.controller - createShipment - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  //var api_key = process.env.API_KEY;
  var api_key = req.user.shipCloudAPI_Key;
  console.log('orders.server.controller - createShipment - api_key: ' +api_key);
  var auth = 'Basic ' + new Buffer(api_key).toString('base64');

  var header =
  {
    'Authorization': auth,
    'Content-Type': 'application/json; charset=utf-8'
  };

  var url = 'https://api.shipcloud.io/v1/shipments';

  var shipment = req.body.data;
  console.log('Shipment: ' + shipment);

  request.post({
    params: shipment,
    url: url,
    headers: header
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
      res.json(r);
    }
    else {
      var req_data = qs.parse(body);
      console.log('Returned values:', body);
      res.send(body);
    }
  });
};


/**
 * shipcloud - getCarriers
 */
exports.getCarriers = function (req, res) {
  console.log('orders.server.controller - getCarriers - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  var api_key = '6871c2bb258255adfeb61fac9ad137a4'; // Sandbox Key
  var auth = 'Basic ' + new Buffer(api_key).toString('base64');

  var header =
  {
    'Authorization': auth,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  var url = 'https://api.shipcloud.io/v1/carriers';

  request.get({
    url: url,
    headers: header
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
      res.json(r);
    }
    else {
      var req_data = qs.parse(body);
      res.send(body);
    }
  });
};
