'use strict';

//Currencys service used for communicating with the currencys REST endpoints
angular.module('currencys').factory('Currencys', ['$resource',
  function ($resource) {
    return $resource('api/currencys/:currencyId', {
      currencyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
