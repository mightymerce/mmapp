'use strict';

/**
 * Module dependencies.
 */
var ordersPolicy = require('../policies/orders.server.policy');


module.exports = function (app) {
  var orders = require('../controllers/orders.server.controller');

  // Orders collection routes
  app.route('/api/orders').all(ordersPolicy.isAllowed)
    .get(orders.list)
    .post(orders.create);

  // Single order routes
  app.route('/api/orders/:orderId').all(ordersPolicy.isAllowed)
    .get(orders.read)
    .put(orders.update)
    .delete(orders.delete);

  // Single order routes
  app.route('/api/orders/:user').all(ordersPolicy.isAllowed)
      .get(orders.read);

  // Single order routes
  app.route('/api/orders/:orderId/edit').all(ordersPolicy.isAllowed)
      .get(orders.read)
      .put(orders.update)
      .delete(orders.delete);

  // Finish by binding the order middleware
  app.param('orderId', orders.orderByID);
};
