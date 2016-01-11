'use strict';

// Configuring the Posts module
angular.module('posts').run(['Menus',
  function (Menus) {
    // Add the Posts dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Posts',
      state: 'posts.list',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'posts', {
      title: 'List Posts',
      state: 'posts.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'posts', {
      title: 'Create Posts',
      state: 'products.list',
      roles: ['admin']
    });

  }
]);
