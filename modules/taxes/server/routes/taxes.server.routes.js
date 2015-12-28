'use strict';

/**
 * Module dependencies.
 */
var taxesPolicy = require('../policies/taxes.server.policy'),
  taxes = require('../controllers/taxes.server.controller');

module.exports = function (app) {
  // Taxes collection routes
  app.route('/api/taxes').all(taxesPolicy.isAllowed)
    .get(taxes.list)
    .post(taxes.create);

  // Single taxe routes
  app.route('/api/taxes/:taxesId').all(taxesPolicy.isAllowed)
    .get(taxes.read)
    .put(taxes.update)
    .delete(taxes.delete);

  // Finish by binding the taxe middleware
  app.param('taxesId', taxes.taxeByID);
};
