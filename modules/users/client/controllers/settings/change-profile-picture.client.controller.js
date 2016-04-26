'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    var uploader = $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {

        var fileExtension = '.' + fileItem.file.name.split('.').pop();
        var index = $scope.uploader.getIndexOfItem(fileItem);

        fileItem.name = 'crop-' + fileItem.file.name + ' (' + index + ')';
        fileItem.size = fileItem.file.size;

        $scope.file = fileItem;

        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };

    $scope.uploadLogoPicture = function (fileItem) {

      console.log('change.profile-picture.client.controller - image uploader - Start uploadLogoPicture');

      if(!fileItem)
      {
        console.log('change.profile-picture.client.controller - image uploader - no fileitem');
      } else {
        // Create blob from cropped file
        var bloblogo = dataURItoBlob(fileItem.toDataURL());
        console.log('change.profile-picture.client.controller - image uploader - after set blob');
        var itemlogo = new FileUploader.FileItem($scope.uploader, $scope.file);
        console.log('change.profile-picture.client.controller - image uploader - after item created');
        itemlogo._file = bloblogo;
        itemlogo.name = 'logo';
        itemlogo.type = 'image/jpeg';

        $scope.uploader.removeFromQueue(0);
        $scope.uploader.queue.push(itemlogo);

        // Clear messages
        $scope.success = $scope.error = null;



        // Upload all files in queue
        $scope.uploader.uploadAll();

        console.log('change.profile-picture.client.controller - image uploader - End uploadProductMainPicture');
      }
    };

    /**
     * Converts data uri to Blob. Necessary for uploading.
     * @see
     *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     * @param  {String} dataURI
     * @return {Blob}
     */
    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };
  }
]);
