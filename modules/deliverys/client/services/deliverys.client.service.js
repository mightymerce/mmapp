'use strict';

//Deliverys service used for communicating with the deliverys REST endpoints
angular.module('deliverys').factory('Deliverys', ['$resource',
  function ($resource) {
    return $resource('api/deliverys/:deliveryId', {
      deliveryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
