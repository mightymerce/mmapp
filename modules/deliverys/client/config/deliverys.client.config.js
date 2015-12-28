'use strict';

// Configuring the Deliverys module
angular.module('deliverys').run(['Menus',
  function (Menus) {
    // Add the deliverys dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Deliverys',
      state: 'deliverys',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'List Deliverys',
      state: 'deliverys.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'deliverys', {
      title: 'Create Deliverys',
      state: 'deliverys.create',
      roles: ['admin']
    });
  }
]);
