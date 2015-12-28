'use strict';

/**
 * Module dependencies.
 */
module.exports = function (app) {

  var productsPolicy = require('../policies/products.server.policy');
  var products = require('../controllers/products.server.controller');

  // Products collection routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  // Single product routes
  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // Single product routes
  app.route('/api/products/:productId/edit').all(productsPolicy.isAllowed)
      .get(products.read)
      .put(products.update)
      .delete(products.delete);

  // Finish by binding the product middleware
  app.param('productId', products.productByID);
};
