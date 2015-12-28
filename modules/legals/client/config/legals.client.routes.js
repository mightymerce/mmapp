'use strict';

// Setting up route
angular.module('legals').config(['$stateProvider',
  function ($stateProvider) {
    // Legals state routing
    $stateProvider
      .state('legals', {
        abstract: true,
        url: '/legals',
        template: '<ui-view/>'
      })
      .state('legals.list', {
        url: '',
        templateUrl: 'modules/legals/client/views/list-legals.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('legals.create', {
        url: '/create',
        templateUrl: 'modules/legals/client/views/create-legal.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('legals.view', {
        url: '/:legalId',
        templateUrl: 'modules/legals/client/views/view-legal.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('legals.edit', {
        url: '/:legalId/edit',
        templateUrl: 'modules/legals/client/views/edit-legal.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
