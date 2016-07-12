'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Delivery = mongoose.model('Delivery'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a delivery
 */
exports.create = function (req, res) {
  var delivery = new Delivery(req.body);
  delivery.user = req.user;

  delivery.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(delivery);
    }
  });
};

/**
 * Show the current delivery
 */
exports.read = function (req, res) {
  res.json(req.delivery);
};

/**
 * Update a delivery
 */
exports.update = function (req, res) {

  console.log('delivery.server.controller - update - start');

  var delivery = req.delivery;

  delivery.deliveryTitle = req.body.deliveryTitle;
  delivery.deliveryTime = req.body.deliveryTime;
  delivery.deliveryCountry = req.body.deliveryCountry;
  delivery.deliveryCost = req.body.deliveryCost;
  delivery.deliveryStandard = req.body.deliveryStandard;

  delivery.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(delivery);
    }
  });
};

/**
 * Delete an delivery
 */
exports.delete = function (req, res) {
  var delivery = req.delivery;

  delivery.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(delivery);
    }
  });
};

/**
 * List of Deliverys
 */
exports.list = function (req, res) {
  Delivery.find(({ user: { $eq: req.query.user } })).sort('-created').populate('user', 'displayName').exec(function (err, deliverys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(deliverys);
    }
  });
};

/**
 * Delivery middleware
 */
exports.deliveryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Delivery is invalid'
    });
  }

  Delivery.findById(id).populate('user', 'displayName').exec(function (err, delivery) {
    if (err) {
      return next(err);
    } else if (!delivery) {
      return res.status(404).send({
        message: 'No delivery with that identifier has been found'
      });
    }
    req.delivery = delivery;
    next();
  });
};
