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
      })
      .state('legals.editcopyright', {
        url: '/:legalId/editcopyright',
        templateUrl: 'modules/legals/client/views/edit-legal-copyright.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('legals.editimprint', {
        url: '/:legalId/editimprint',
        templateUrl: 'modules/legals/client/views/edit-legal-imprint.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('legals.editreturnpolicy', {
        url: '/:legalId/editreturnpolicy',
        templateUrl: 'modules/legals/client/views/edit-legal-returnpolicy.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('legals.edittermsandconditions', {
        url: '/:legalId/edittermsandconditions',
        templateUrl: 'modules/legals/client/views/edit-legal-termsandconditions.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
