'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    console.log('user.client.service - update - start');
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users').factory('stripeCreateSubscription', ['$resource',
  function($resource) {
    return $resource('/api/users/stripeCreateSubscription/:USER/:PLAN/:TOKEN', {
      USER: '',
      PLAN: '',
      TOKEN: ''
    }, {
      query: { method: 'GET', isArray: false }
    });
  }
]);

angular.module('users').factory('stripeUpdateSubscription', ['$resource',
  function($resource) {
    return $resource('/api/users/stripeUpdateSubscription/:CUSID/:SUBID/:PLAN', {
      CUSID: '',
      SUBID: '',
      PLAN: ''
    }, {
      query: { method: 'GET', isArray: false }
    });
  }
]);

angular.module('users').factory('stripeCancelSubscription', ['$resource',
  function($resource) {
    return $resource('/api/users/stripeCancelSubscription/:CUSID/:SUBID', {
      CUSID: '',
      SUBID: ''
    }, {
      query: { method: 'GET', isArray: false }
    });
  }
]);

angular.module('users').factory('stripeCreateCCToken', ['$resource',
  function($resource) {
    return $resource('/api/users/stripeCreateCCToken', {}, {
      query: { method: 'GET', isArray: false }
    });
  }
]);

angular.module('users').factory('stripeCreateMonthlyDebit', ['$resource',
  function($resource) {
    return $resource('/api/users/stripeCreateMonthlyDebit/:CUSID/:CHARGE', {}, {
      query: { method: 'GET', isArray: false }
    });
  }
]);
