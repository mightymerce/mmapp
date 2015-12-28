'use strict';

// Setting up route
angular.module('orders').config(['$stateProvider',
  function ($stateProvider) {
    // Orders state routing
    $stateProvider
        .state('orders', {
          abstract: true,
          url: '/orders',
          template: '<ui-view/>'
        })
        .state('orders.list', {
          url: '',
          templateUrl: 'modules/orders/client/views/list-order.client.view.html'
        })
        .state('orders.create', {
          url: '/create',
          templateUrl: 'modules/orders/client/views/create-order.client.view.html',
          data: {
            roles: ['user', 'admin']
          }
        })
        .state('orders.edit', {
          url: '/:orderId/edit',
          templateUrl: 'modules/orders/client/views/edit-order.client.view.html',
          data: {
            roles: ['user', 'admin']
          }
        });
  }
]);
