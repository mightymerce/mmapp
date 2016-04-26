'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Legal = mongoose.model('Legal'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a legal
 */
exports.create = function (req, res) {
  var legal = new Legal(req.body);
  legal.user = req.user;

  legal.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(legal);
    }
  });
};

/**
 * Show the current legal
 */
exports.read = function (req, res) {
  res.json(req.legal);
};

/**
 * Update a legal
 */
exports.update = function (req, res) {

  console.log('legal.server.controller - update - start');

  var legal = req.legal;

  legal.legalPrivacyPolicy = req.body.legalPrivacyPolicy;
  legal.legalReturnPolicy = req.body.legalReturnPolicy;
  legal.legalTermsandConditions = req.body.legalTermsandConditions;
  legal.legalImprint = req.body.legalImprint;
  legal.legalCopyright = req.body.legalCopyright;

  console.log('$scope.legal.legalCopyright: ' +req.body.legalCopyright);

  legal.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(legal);
    }
  });
};

/**
 * Delete an legal
 */
exports.delete = function (req, res) {
  var legal = req.legal;

  legal.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(legal);
    }
  });
};

/**
 * List of Legals
 */
exports.list = function (req, res) {
  Legal.find(({ user: { $eq: req.query.user } })).sort('-created').populate('user', 'displayname').exec(function (err, legals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(legals[0]);
    }
  });
};

/**
 * Legal middleware
 */
exports.legalByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Legal is invalid'
    });
  }

  Legal.findById(id).populate('user', 'displayName').exec(function (err, legal) {
    if (err) {
      return next(err);
    } else if (!legal) {
      return res.status(404).send({
        message: 'No legal with that identifier has been found'
      });
    }
    req.legal = legal;
    next();
  });
};
