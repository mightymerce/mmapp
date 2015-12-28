'use strict';

/**
 * Module dependencies.
 */
var currencysPolicy = require('../policies/currencys.server.policy'),
  currencys = require('../controllers/currencys.server.controller');

module.exports = function (app) {
  // Currencys collection routes
  app.route('/api/currencys').all(currencysPolicy.isAllowed)
    .get(currencys.list)
    .post(currencys.create);

  // Single currency routes
  app.route('/api/currencys/:currencyId').all(currencysPolicy.isAllowed)
    .get(currencys.read)
    .put(currencys.update)
    .delete(currencys.delete);

  // Finish by binding the currency middleware
  app.param('currencyId', currencys.currencyByID);
};
