'use strict';

/**
 * Module dependencies.
 */
var legalsPolicy = require('../policies/legals.server.policy'),
  legals = require('../controllers/legals.server.controller');

module.exports = function (app) {
  // Legals collection routes
  app.route('/api/legals').all(legalsPolicy.isAllowed)
    .get(legals.list)
    .post(legals.create);

  // Single legal routes
  app.route('/api/legals/:legalId').all(legalsPolicy.isAllowed)
    .get(legals.read)
    .put(legals.update)
    .delete(legals.delete);

  // Finish by binding the legal middleware
  app.param('legalId', legals.legalByID);
};
