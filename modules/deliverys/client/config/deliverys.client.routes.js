'use strict';

// Setting up route
angular.module('deliverys').config(['$stateProvider',
  function ($stateProvider) {
    // Deliverys state routing
    $stateProvider
      .state('deliverys', {
        abstract: true,
        url: '/deliverys',
        template: '<ui-view/>'
      })
      .state('deliverys.list', {
        url: '',
        templateUrl: 'modules/deliverys/client/views/list-deliverys.client.view.html'
      })
      .state('deliverys.create', {
        url: '/create',
        templateUrl: 'modules/deliverys/client/views/create-delivery.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('deliverys.view', {
        url: '/:deliveryId',
        templateUrl: 'modules/deliverys/client/views/view-delivery.client.view.html'
      })
      .state('deliverys.edit', {
        url: '/:deliveryId/edit',
        templateUrl: 'modules/deliverys/client/views/edit-delivery.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
