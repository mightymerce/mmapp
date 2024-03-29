'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Currency = mongoose.model('Currency'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a currency
 */
exports.create = function (req, res) {
  var currency = new Currency(req.body);
  currency.user = req.user;

  currency.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currency);
    }
  });
};

/**
 * Show the current currency
 */
exports.read = function (req, res) {
  res.json(req.currency);
};

/**
 * Update a currency
 */
exports.update = function (req, res) {

  console.log('currencys.server.controller - update - start');


  var currency = req.currency;

  currency.currencyCode = req.body.currencyCode;
  currency.currencyValue = req.body.currencyValue;
  currency.currencyStandard = req.body.currencyStandard;

  currency.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currency);
    }
  });
};

/**
 * Delete an currency
 */
exports.delete = function (req, res) {
  var currency = req.currency;

  currency.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currency);
    }
  });
};

/**
 * List of Currencys
 */
exports.list = function (req, res) {
  Currency.find(({ user: { $eq: req.query.user } })).sort('-created').populate('user', 'displayName').exec(function (err, currencys) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(currencys);
    }
  });
};

/**
 * Currency middleware
 */
exports.currencyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Currency is invalid'
    });
  }

  Currency.findById(id).populate('user', 'displayName').exec(function (err, currency) {
    if (err) {
      return next(err);
    } else if (!currency) {
      return res.status(404).send({
        message: 'No currency with that identifier has been found'
      });
    }
    req.currency = currency;
    next();
  });
};
