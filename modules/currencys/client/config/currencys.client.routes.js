'use strict';

// Setting up route
angular.module('currencys').config(['$stateProvider',
  function ($stateProvider) {
    // Currencys state routing
    $stateProvider
      .state('currencys', {
        abstract: true,
        url: '/currencys',
        template: '<ui-view/>'
      })
      .state('currencys.list', {
        url: '',
        templateUrl: 'modules/currencys/client/views/list-currencys.client.view.html'
      })
      .state('currencys.create', {
        url: '/create',
        templateUrl: 'modules/currencys/client/views/create-currency.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('currencys.view', {
        url: '/:currencyId',
        templateUrl: 'modules/currencys/client/views/view-currency.client.view.html'
      })
      .state('currencys.edit', {
        url: '/:currencyId/edit',
        templateUrl: 'modules/currencys/client/views/edit-currency.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
