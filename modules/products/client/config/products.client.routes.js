'use strict';

// Setting up route
angular.module('products').config(['$stateProvider',
  function ($stateProvider) {
    // Products state routing
    $stateProvider
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>'
      })
      .state('products.list', {
        url: '',
        templateUrl: 'modules/products/client/views/list-product.client.view.html'
      })
      .state('products.create', {
        url: '/create',
        templateUrl: 'modules/products/client/views/create-product.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('products.create-product-pictures', {
        url: '/:productId/create-product-pictures',
        templateUrl: 'modules/products/client/views/create-pictures.product.modal.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('products.view', {
        url: '/:productId/view',
        templateUrl: 'modules/products/client/views/view-product.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('products.edit', {
        url: '/:productId/edit',
        templateUrl: 'modules/products/client/views/edit-product.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('products.editmedia', {
        url: '/:productId/editmedia',
        templateUrl: 'modules/products/client/views/edit-media-product.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('products.editchannel', {
        url: '/:productId/editchannel',
        templateUrl: 'modules/products/client/views/edit-channel-product.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
    ;
  }
]);
