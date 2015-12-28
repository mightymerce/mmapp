'use strict';

// Setting up route
angular.module('taxes').config(['$stateProvider',
  function ($stateProvider) {
    // Taxes state routing
    $stateProvider
      .state('taxes', {
        abstract: true,
        url: '/taxes',
        template: '<ui-view/>'
      })
      .state('taxes.list', {
        url: '',
        templateUrl: 'modules/taxes/client/views/list-taxes.client.view.html'
      })
      .state('taxes.create', {
        url: '/create',
        templateUrl: 'modules/taxes/client/views/create-taxe.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('taxes.view', {
        url: '/:taxesId',
        templateUrl: 'modules/taxes/client/views/view-taxe.client.view.html'
      })
      .state('taxes.edit', {
        url: '/:taxesId/edit',
        templateUrl: 'modules/taxes/client/views/edit-taxe.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
