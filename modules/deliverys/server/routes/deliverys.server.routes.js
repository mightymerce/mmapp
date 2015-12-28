'use strict';

/**
 * Module dependencies.
 */
var deliverysPolicy = require('../policies/deliverys.server.policy'),
  deliverys = require('../controllers/deliverys.server.controller');

module.exports = function (app) {
  // Deliverys collection routes
  app.route('/api/deliverys').all(deliverysPolicy.isAllowed)
    .get(deliverys.list)
    .post(deliverys.create);

  // Single delivery routes
  app.route('/api/deliverys/:deliveryId').all(deliverysPolicy.isAllowed)
    .get(deliverys.read)
    .put(deliverys.update)
    .delete(deliverys.delete);

  // Finish by binding the delivery middleware
  app.param('deliveryId', deliverys.deliveryByID);
};
