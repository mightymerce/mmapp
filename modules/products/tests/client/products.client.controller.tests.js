'use strict';

(function () {
  // Articles Controller Spec
  describe('Products Controller Tests', function () {
    // Initialize global variables
    var ProductsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Products,
      mockProducts;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Products_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Products = _Products_;

      // create mock Products
      mockProducts = new Products({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Products controller.
      ProductsController = $controller('ProductsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one Products object fetched from XHR', inject(function (Products) {
      // Create a sample Products array that includes the new Products
      var sampleProducts = [mockProducts];

      // Set GET response
      $httpBackend.expectGET('api/products').respond(sampleProducts);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.products).toEqualData(sampleProducts);
    }));

    it('$scope.findOne() should create an array with one Products object fetched from XHR using a productsId URL parameter', inject(function (Products) {
      // Set the URL parameter
      $stateParams.productsId = mockProducts._id;

      // Set GET response
      $httpBackend.expectGET(/api\/products\/([0-9a-fA-F]{24})$/).respond(mockProducts);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.article).toEqualData(mockProducts);
    }));

    describe('$scope.create()', function () {
      var sampleProductsPostData;

      beforeEach(function () {
        // Create a sample Products object
        sampleProductsPostData = new Products({
          title: 'An Products about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Products about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Products) {
        // Set POST response
        $httpBackend.expectPOST('api/products', sampleProductsPostData).respond(mockProducts);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the article was created
        expect($location.path.calls.mostRecent().args[0]).toBe('products/' + mockProducts._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/products', sampleProductsPostData).respond(400, {
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
        scope.article = mockProducts;
      });

      it('should update a valid article', inject(function (Products) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/products\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/products/' + mockProducts._id);
      }));

      it('should set scope.error to error response message', inject(function (Products) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/products\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(products)', function () {
      beforeEach(function () {
        // Create new Products array and include the Products
        scope.products = [mockProducts, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/products\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockProducts);
      });

      it('should send a DELETE request with a valid productsId and remove the article from the scope', inject(function (Products) {
        expect(scope.products.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.products = mockProducts;

        $httpBackend.expectDELETE(/api\/products\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to products', function () {
        expect($location.path).toHaveBeenCalledWith('products');
      });
    });
  });
}());
