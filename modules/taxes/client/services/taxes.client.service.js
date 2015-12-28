'use strict';

//Taxes service used for communicating with the taxes REST endpoints
angular.module('taxes').factory('Taxes', ['$resource',
  function ($resource) {
    console.log('start update in service');
    return $resource('api/taxes/:taxesId', {
      taxesId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
