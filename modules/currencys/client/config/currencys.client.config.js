'use strict';

// Configuring the Currencys module
angular.module('currencys').run(['Menus',
  function (Menus) {
    // Add the currencys dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Shop Settings',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Currencys',
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
