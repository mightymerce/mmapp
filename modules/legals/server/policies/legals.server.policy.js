'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Legals Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/legals',
      permissions: '*'
    }, {
      resources: '/api/legals/:legalId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/legals',
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/legals/:legalId',
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/legals/:legaltId/edit',
      permissions: ['get', 'post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/legals',
      permissions: ['get']
    }, {
      resources: '/api/legals/:legalId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Legals Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an legal is being processed and the current user created it then allow any manipulation
  if (req.legal && req.user && req.legal.user.id === req.user.id) {
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
