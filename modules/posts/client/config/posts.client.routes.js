'use strict';

// Setting up route
angular.module('posts').config(['$stateProvider',
  function ($stateProvider) {
    // Posts state routing
    $stateProvider
        .state('posts', {
          abstract: true,
          url: '/posts',
          template: '<ui-view/>'
        })
        .state('posts.list', {
          url: '',
          templateUrl: 'modules/posts/client/views/list-post.client.view.html'
        })
        .state('posts.create', {
          url: '/create',
          templateUrl: 'modules/posts/client/views/create-post.client.view.html',
          data: {
            roles: ['user', 'admin']
          }
        })
        .state('posts.view', {
          url: '/:postId/edit',
          templateUrl: 'modules/posts/client/views/edit-posts.client.view.html',
          data: {
            roles: ['user', 'admin']
          }
        })
        .state('posts.edit', {
          url: '/:postId/edit',
          templateUrl: 'modules/posts/client/views/edit-posts.client.view.html',
          data: {
            roles: ['user', 'admin']
          }
        });
  }
]);
