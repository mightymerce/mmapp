'use strict';

(function () {
  // Articles Controller Spec
  describe('Channels Controller Tests', function () {
    // Initialize global variables
    var ChannelsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Channels,
      mockChannels;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Channels_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Channels = _Channels_;

      // create mock Channels
      mockChannels = new Channels({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Channels controller.
      ChannelsController = $controller('ChannelsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one Channels object fetched from XHR', inject(function (Channels) {
      // Create a sample Channels array that includes the new Channels
      var sampleChannels = [mockChannels];

      // Set GET response
      $httpBackend.expectGET('api/channels').respond(sampleChannels);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.channels).toEqualData(sampleChannels);
    }));

    it('$scope.findOne() should create an array with one Channels object fetched from XHR using a channelsId URL parameter', inject(function (Channels) {
      // Set the URL parameter
      $stateParams.channelsId = mockChannels._id;

      // Set GET response
      $httpBackend.expectGET(/api\/channels\/([0-9a-fA-F]{24})$/).respond(mockChannels);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.article).toEqualData(mockChannels);
    }));

    describe('$scope.create()', function () {
      var sampleChannelsPostData;

      beforeEach(function () {
        // Create a sample Channels object
        sampleChannelsPostData = new Channels({
          title: 'An Channels about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Channels about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Channels) {
        // Set POST response
        $httpBackend.expectPOST('api/channels', sampleChannelsPostData).respond(mockChannels);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the article was created
        expect($location.path.calls.mostRecent().args[0]).toBe('channels/' + mockChannels._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/channels', sampleChannelsPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock article in scope
        scope.article = mockChannels;
      });

      it('should update a valid article', inject(function (Channels) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/channels\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/channels/' + mockChannels._id);
      }));

      it('should set scope.error to error response message', inject(function (Channels) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/channels\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(channels)', function () {
      beforeEach(function () {
        // Create new Channels array and include the Channels
        scope.channels = [mockChannels, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/channels\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockChannels);
      });

      it('should send a DELETE request with a valid channelsId and remove the article from the scope', inject(function (Channels) {
        expect(scope.channels.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.channels = mockChannels;

        $httpBackend.expectDELETE(/api\/channels\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to channels', function () {
        expect($location.path).toHaveBeenCalledWith('channels');
      });
    });
  });
}());
