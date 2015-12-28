'use strict';

//Channels service used for communicating with the channels REST endpoints
angular.module('channels').factory('Channels', ['$resource',
  function ($resource) {
    return $resource('api/channels/:channelId', {
      channelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
