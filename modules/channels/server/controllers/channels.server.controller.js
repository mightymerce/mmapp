'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Channel = mongoose.model('Channel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a channel
 */
exports.create = function (req, res) {
  var channel = new Channel(req.body);
  channel.user = req.user;

  channel.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(channel);
    }
  });
};

/**
 * Show the current channel
 */
exports.read = function (req, res) {
  res.json(req.channel);
};

/**
 * Update a channel
 */
exports.update = function (req, res) {
  var channel = req.channel;

  channel.title = req.body.title;
  channel.content = req.body.content;

  channel.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(channel);
    }
  });
};

/**
 * Delete an channel
 */
exports.delete = function (req, res) {
  var channel = req.channel;

  channel.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(channel);
    }
  });
};

/**
 * List of Channels
 */
exports.list = function (req, res) {
  Channel.find().sort('-created').populate('user', 'displayName').exec(function (err, channels) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(channels);
    }
  });
};

/**
 * Channel middleware
 */
exports.channelByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Channel is invalid'
    });
  }

  Channel.findById(id).populate('user', 'displayName').exec(function (err, channel) {
    if (err) {
      return next(err);
    } else if (!channel) {
      return res.status(404).send({
        message: 'No channel with that identifier has been found'
      });
    }
    req.channel = channel;
    next();
  });
};
