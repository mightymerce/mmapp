'use strict';

// Setting up route
angular.module('checkouts').config(['$stateProvider', '$locationProvider',
  function ($stateProvider, $locationProvider) {
    // Checkouts state routing
    $stateProvider
      .state('checkouts', {
        abstract: true,
        url: '/checkouts',
        template: '<ui-view/>'
      })
      .state('checkouts.list', {
        url: '',
        templateUrl: 'modules/checkouts/client/views/list-checkouts.client.view.html'
      })
      .state('checkouts.create', {
        url: '/create',
        templateUrl: 'modules/checkouts/client/views/create-checkout.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('checkouts.view', {
        url: '/:checkoutId',
        templateUrl: 'modules/checkouts/client/views/view-checkout.client.view.html',
        css: {
          href: 'modules/checkouts/client/css/style-min.css',
          preload: true,
          persist: true
        }
      })
      .state('checkouts.review', {
        url: '/review/review',
        templateUrl: 'modules/checkouts/client/views/review-checkout.client.view.html',
        css: {
          href: 'modules/checkouts/client/css/style-min.css',
          preload: true,
          persist: true
        }
      })
      .state('checkouts.success', {
        url: '/success/success',
        templateUrl: 'modules/checkouts/client/views/success-checkout.client.view.html'
      })
      .state('checkouts.cancel', {
        url: '/cancel/cancel',
        templateUrl: 'modules/checkouts/client/views/cancel-checkout.client.view.html'
      })
      .state('checkouts.edit', {
        url: '/:checkoutId/edit',
        templateUrl: 'modules/checkouts/client/views/edit-checkout.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
