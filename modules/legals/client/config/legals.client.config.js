'use strict';

// Configuring the Legals module
angular.module('legals').run(['Menus',
  function (Menus) {
    // Add the legals dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Legals',
      state: 'legals',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Legals',
      state: 'legals.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'legals', {
      title: 'Create Legals',
      state: 'legals.create',
      roles: ['admin']
    });
  }
]);
