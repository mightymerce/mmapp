'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Checkouts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/checkouts',
      permissions: '*'
    }, {
      resources: '/api/checkouts/:checkoutId',
      permissions: '*'
    }, {
      resources: '/api/paypal/paypalSetExpressCheckout/:user',
      permissions: ['get', 'post']
    }, {
      resources: '/api/paypal/paypalGetExpressCheckoutDetails',
      permissions: ['get', 'post']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/checkouts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/checkouts/:checkoutId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/checkouts',
      permissions: ['get']
    }, {
      resources: '/api/checkouts/:checkoutId',
      permissions: ['get']
    }, {
      resources: '/api/paypal/paypalSetExpressCheckout/:USER/:PWD/:SIGNATURE/:returnUrl/:cancelUrl/:brandName/:brandLogoUrl/:productName/:productDescription/:productQuantity/:cartAmount/:buyerMail/:productCurrency',
      permissions: ['get', 'post']
    }, {
      resources: '/api/paypal/paypalGetExpressCheckoutDetails/:USER/:PWD/:SIGNATURE/:token/:doPayment',
      permissions: ['get', 'post']
    }]
  }]);
};

/**
 * Check If Checkouts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an checkout is being processed and the current user created it then allow any manipulation
  if (req.checkout && req.user && req.checkout.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
