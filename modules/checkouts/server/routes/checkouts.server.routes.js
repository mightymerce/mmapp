'use strict';

/**
 * Module dependencies.
 */
var checkoutsPolicy = require('../policies/checkouts.server.policy'),
  checkouts = require('../controllers/checkouts.server.controller');

module.exports = function (app) {
  // Checkouts collection routes
  app.route('/api/checkouts').all(checkoutsPolicy.isAllowed)
    .get(checkouts.list)
    .post(checkouts.create);

  // Single checkout routes
  app.route('/api/checkouts/:checkoutId').all(checkoutsPolicy.isAllowed)
    .get(checkouts.read)
    .put(checkouts.update)
    .delete(checkouts.delete);

  // Paypal checkout routes
  app.route('/api/paypal/paypalSetExpressCheckout/:USER/:PWD/:SIGNATURE/:returnUrl/:cancelUrl/:brandName/:brandLogoUrl/:productName/:productDescription/:productQuantity/:cartAmount/:buyerMail/:productCurrency/:cartShippingAmount/:productItemAmount/:productNo').all(checkoutsPolicy.isAllowed)
    .get(checkouts.paypalSetExpressCheckout);

  app.route('/api/paypal/paypalGetExpressCheckoutDetails/:USER/:PWD/:SIGNATURE/:token/:doPayment').all(checkoutsPolicy.isAllowed)
      .get(checkouts.paypalGetExpressCheckoutDetails);

  // Finish by binding the checkout middleware
  app.param('checkoutId', checkouts.checkoutByID);


};
