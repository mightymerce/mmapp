'use strict';

// Channels controller
angular.module('channels').controller('ChannelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Channels',
  function ($scope, $stateParams, $location, Authentication, Channels) {
    $scope.authentication = Authentication;

    // Create new Channel
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'channelForm');

        return false;
      }

      // Create new Channel object
      var channel = new Channels({
        channelId: this.channelId,
        channelType: this.channelType,
        channelName: this.channelName,
        channelAccessToken: this.channelAccessToken
      });

      // Redirect after save
      channel.$save(function (response) {
        $location.path('channels/' + response._id);

        // Clear form fields
        $scope.channelId = '';
        $scope.channelDate = '';
        $scope.channelCustomer = '';
        $scope.channelStatus = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Channel
    $scope.remove = function (channel) {
      if (channel) {
        channel.$remove();

        for (var i in $scope.channels) {
          if ($scope.channels[i] === channel) {
            $scope.channels.splice(i, 1);
          }
        }
      } else {
        $scope.channel.$remove(function () {
          $location.path('channels');
        });
      }
    };

    // Update existing Channel
    $scope.update = function (isValid) {
      $scope.error = null;

      console.log('Channel Update');

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'channelForm');

        return false;
      }

      var channel = $scope.channel;

      channel.$update(function () {
        $location.path('channels/' + channel._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Channels
    $scope.find = function () {
      $scope.channels = Channels.query();
    };

    // Find existing Channel
    $scope.findOne = function () {
      $scope.channel = Channels.get({
        channelId: $stateParams.channelId
      });
    };
  }
]);
