'use strict';

angular.module('users').controller('ProductPicturesController', ['$scope', '$timeout', '$window', 'Authentication', 'Products', 'FileUploader',
    function ($scope, $timeout, $window, Authentication, Products, FileUploader) {

      //$scope.imageURL = $scope.product.imageURL;

      // Create file uploader instance
      $scope.uploader = new FileUploader({
        url: 'api/products/picture',
        //alias: 'newProductPicture'
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
      $scope.uploader.onAfterAddingFile = function (fileItem) {
        console.log('Start adding file: Function onAfterAddingFile');

        if ($window.FileReader) {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(fileItem._file);

          fileReader.onload = function (fileReaderEvent) {
            $timeout(function () {
              $scope.imageURL = fileReaderEvent.target.result;
              console.log('product client controller: fileReader.onload' + $scope.imageURL);
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
      $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
        // Clear upload buttons
        $scope.cancelUpload();

        // Show error message
        $scope.error = response.message;
      };

      // Change user profile picture
      $scope.uploadProductMainPicture = function () {
        // Clear messages
        $scope.success = $scope.error = null;

        console.log('Start upload: Function uploadProductMainPicture');

        // Start upload
        $scope.uploader.uploadAll();
        console.log('After upload: Function uploadProductMainPicture');
        console.log('ImageURL: ' + $scope.imageURL);
      };

      // Cancel the upload process
      $scope.cancelUpload = function () {
        $scope.uploader.clearQueue();
        //$scope.imageURL = $scope.user.profileImageURL;
      };
    }
]);
