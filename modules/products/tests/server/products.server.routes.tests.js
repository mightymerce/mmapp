'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Products = mongoose.model('Products'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, products;

/**
 * Products routes tests
 */
describe('Products CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new products
    user.save(function () {
      products = {
        title: 'Products Title',
        content: 'Products Content'
      };

      done();
    });
  });

  it('should be able to save an products if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/products')
          .send(products)
          .expect(200)
          .end(function (productsSaveErr, productsSaveRes) {
            // Handle Products save error
            if (productsSaveErr) {
              return done(productsSaveErr);
            }

            // Get a list of articles
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle article save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get articles list
                var articles = productsGetRes.body;

                // Set assertions
                (articles[0].user._id).should.equal(userId);
                (articles[0].title).should.match('Products Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an products if not logged in', function (done) {
    agent.post('/api/products')
      .send(products)
      .expect(403)
      .end(function (productsSaveErr, productsSaveRes) {
        // Call the assertion callback
        done(productsSaveErr);
      });
  });

  it('should not be able to save an products if no title is provided', function (done) {
    // Invalidate title field
    products.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/products')
          .send(products)
          .expect(400)
          .end(function (productsSaveErr, productsSaveRes) {
            // Set message assertion
            (productsSaveRes.body.message).should.match('Title cannot be blank');

            // Handle article save error
            done(productsSaveErr);
          });
      });
  });

  it('should be able to update an products if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/products')
          .send(products)
          .expect(200)
          .end(function (productsSaveErr, productsSaveRes) {
            // Handle products save error
            if (productsSaveErr) {
              return done(productsSaveErr);
            }

            // Update products title
            products.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing article
            agent.put('/api/products/' + productsSaveRes.body._id)
              .send(products)
              .expect(200)
              .end(function (productsUpdateErr, productsUpdateRes) {
                // Handle products update error
                if (productsUpdateErr) {
                  return done(productsUpdateErr);
                }

                // Set assertions
                (productsUpdateRes.body._id).should.equal(productsSaveRes.body._id);
                (productsUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Products if not signed in', function (done) {
    // Create new Products model instance
    var productsObj = new Products(products);

    // Save the Products
    productsObj.save(function () {
      // Request Products
      request(app).get('/api/products')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Products if not signed in', function (done) {
    // Create new Products model instance
    var productsObj = new Products(products);

    // Save the Products
    productsObj.save(function () {
      request(app).get('/api/products/' + productsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', products.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Products with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/products/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Products is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Products which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Products
    request(app).get('/api/products/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Products with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Products if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Products
        agent.post('/api/prticles')
          .send(products)
          .expect(200)
          .end(function (productsSaveErr, productsSaveRes) {
            // Handle Products save error
            if (productsSaveErr) {
              return done(productsSaveErr);
            }

            // Delete an existing Products
            agent.delete('/api/products/' + productsSaveRes.body._id)
              .send(products)
              .expect(200)
              .end(function (productsDeleteErr, productsDeleteRes) {
                // Handle Products error error
                if (productsDeleteErr) {
                  return done(productsDeleteErr);
                }

                // Set assertions
                (productsDeleteRes.body._id).should.equal(productsSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an products if not signed in', function (done) {
    // Set article user
    products.user = user;

    // Create new products model instance
    var productsObj = new Products(products);

    // Save the article
    productsObj.save(function () {
      // Try deleting products
      request(app).delete('/api/products/' + productsObj._id)
        .expect(403)
        .end(function (productsDeleteErr, productsDeleteRes) {
          // Set message assertion
          (productsDeleteRes.body.message).should.match('User is not authorized');

          // Handle products error error
          done(productsDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Products.remove().exec(done);
    });
  });
});
