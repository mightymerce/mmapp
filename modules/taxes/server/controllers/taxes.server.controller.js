'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Taxe = mongoose.model('Taxe'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a taxe
 */
exports.create = function (req, res) {
  var taxe = new Taxe(req.body);
  taxe.user = req.user;

  taxe.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(taxe);
    }
  });
};

/**
 * Show the current taxe
 */
exports.read = function (req, res) {
  res.json(req.taxe);
};

/**
 * Update a taxe
 */
exports.update = function (req, res) {
  console.log('taxes.server.controller - update - start');
  var taxe = req.taxe;

  taxe.taxCountry = req.body.taxCountry;
  taxe.taxRate = req.body.taxRate;

  taxe.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(taxe);
    }
  });
};

/**
 * Delete an taxe
 */
exports.delete = function (req, res) {
  var taxe = req.taxe;

  taxe.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(taxe);
    }
  });
};

/**
 * List of Taxes
 */
exports.list = function (req, res) {
  Taxe.find().sort('-created').populate('user', 'displayName').exec(function (err, taxes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(taxes);
    }
  });
};

/**
 * Taxe middleware
 */
exports.taxeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Taxe is invalid'
    });
  }

  Taxe.findById(id).populate('user', 'displayName').exec(function (err, taxe) {
    if (err) {
      return next(err);
    } else if (!taxe) {
      return res.status(404).send({
        message: 'No taxe with that identifier has been found'
      });
    }
    req.taxe = taxe;
    next();
  });
};
