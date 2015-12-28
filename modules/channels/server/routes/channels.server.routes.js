'use strict';

/**
 * Module dependencies.
 */
var channelsPolicy = require('../policies/channels.server.policy');
var channels = require('../controllers/channels.server.controller');

module.exports = function (app) {
  // Channels collection routes
  app.route('/api/channels').all(channelsPolicy.isAllowed)
    .get(channels.list)
    .post(channels.create);

  // Single channel routes
  app.route('/api/channels/:channelId').all(channelsPolicy.isAllowed)
    .get(channels.read)
    .put(channels.update)
    .delete(channels.delete);

  // Single channel routes
  app.route('/api/channels/:channelId/edit').all(channelsPolicy.isAllowed)
      .get(channels.read)
      .put(channels.update)
      .delete(channels.delete);

  // Finish by binding the channel middleware
  app.param('channelId', channels.channelByID);
};
