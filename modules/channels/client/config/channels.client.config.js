'use strict';

// Configuring the Channels module
angular.module('channels').run(['Menus',
  function (Menus) {
    // Add the Channels dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Channels',
      state: 'channels',
      type: 'dropdown',
      roles: ['guest']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'channels', {
      title: 'List Channels',
      state: 'channels.list',
      roles: ['guest']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'channels', {
      title: 'Create Channels',
      state: 'channels.create',
      roles: ['guest']
    });

  }
]);
