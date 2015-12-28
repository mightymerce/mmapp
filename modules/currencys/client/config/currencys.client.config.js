'use strict';

// Configuring the Currencys module
angular.module('currencys').run(['Menus',
  function (Menus) {
    // Add the currencys dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Settings',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'List Currencys',
      state: 'currencys.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'currencys', {
      title: 'Create Currencys',
      state: 'currencys.create',
      roles: ['admin']
    });
  }
]);
