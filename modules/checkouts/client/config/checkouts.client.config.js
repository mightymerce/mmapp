'use strict';

// Configuring the Checkouts module
angular.module('checkouts').run(['Menus',
  function (Menus) {
    // Add the checkouts dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Checkouts',
      state: 'checkouts',
      type: 'dropdown',
      roles: ['guest']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'checkouts', {
      title: 'List Checkouts',
      state: 'checkouts.list',
      roles: ['guest']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'checkouts', {
      title: 'Create Checkouts',
      state: 'checkouts.create',
      roles: ['guest']
    });
  }
]);
