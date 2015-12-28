'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Channels Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/channels',
      permissions: '*'
    }, {
      resources: '/api/channels/:channelId',
      permissions: '*'
    }, {
      resources: '/api/channels/:channelId/edit',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/channels',
      permissions: ['get', 'post']
    }, {
      resources: '/api/channels/:channelId',
      permissions: ['get']
    }, {
      resources: '/api/channels/:channelId/edit',
      permissions: ['get', 'post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/channels',
      permissions: ['get']
    }, {
      resources: '/api/channels/:channelId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Channels Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an channel is being processed and the current user created it then allow any manipulation
  if (req.channel && req.user && req.channel.user.id === req.user.id) {
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
