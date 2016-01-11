'use strict';

// Configuring the Taxes module
angular.module('taxes').run(['Menus',
  function (Menus) {
    // Add the taxes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Taxes',
      state: 'taxes',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Taxes',
      state: 'taxes.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'taxes', {
      title: 'Create Taxes',
      state: 'taxes.create',
      roles: ['admin']
    });
  }
]);
