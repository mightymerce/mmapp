'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Orders = mongoose.model('Orders'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, orders;

/**
 * Orders routes tests
 */
describe('Orders CRUD tests', function () {

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

    // Save a user to the test db and create new orders
    user.save(function () {
      orders = {
        title: 'Orders Title',
        content: 'Orders Content'
      };

      done();
    });
  });

  it('should be able to save an orders if logged in', function (done) {
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
        agent.post('/api/orders')
          .send(orders)
          .expect(200)
          .end(function (ordersSaveErr, ordersSaveRes) {
            // Handle Orders save error
            if (ordersSaveErr) {
              return done(ordersSaveErr);
            }

            // Get a list of articles
            agent.get('/api/orders')
              .end(function (ordersGetErr, ordersGetRes) {
                // Handle article save error
                if (ordersGetErr) {
                  return done(ordersGetErr);
                }

                // Get articles list
                var articles = ordersGetRes.body;

                // Set assertions
                (articles[0].user._id).should.equal(userId);
                (articles[0].title).should.match('Orders Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an orders if not logged in', function (done) {
    agent.post('/api/orders')
      .send(orders)
      .expect(403)
      .end(function (ordersSaveErr, ordersSaveRes) {
        // Call the assertion callback
        done(ordersSaveErr);
      });
  });

  it('should not be able to save an orders if no title is provided', function (done) {
    // Invalidate title field
    orders.title = '';

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
        agent.post('/api/orders')
          .send(orders)
          .expect(400)
          .end(function (ordersSaveErr, ordersSaveRes) {
            // Set message assertion
            (ordersSaveRes.body.message).should.match('Title cannot be blank');

            // Handle article save error
            done(ordersSaveErr);
          });
      });
  });

  it('should be able to update an orders if signed in', function (done) {
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
        agent.post('/api/orders')
          .send(orders)
          .expect(200)
          .end(function (ordersSaveErr, ordersSaveRes) {
            // Handle orders save error
            if (ordersSaveErr) {
              return done(ordersSaveErr);
            }

            // Update orders title
            orders.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing article
            agent.put('/api/orders/' + ordersSaveRes.body._id)
              .send(orders)
              .expect(200)
              .end(function (ordersUpdateErr, ordersUpdateRes) {
                // Handle orders update error
                if (ordersUpdateErr) {
                  return done(ordersUpdateErr);
                }

                // Set assertions
                (ordersUpdateRes.body._id).should.equal(ordersSaveRes.body._id);
                (ordersUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Orders if not signed in', function (done) {
    // Create new Orders model instance
    var ordersObj = new Orders(orders);

    // Save the Orders
    ordersObj.save(function () {
      // Request Orders
      request(app).get('/api/orders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Orders if not signed in', function (done) {
    // Create new Orders model instance
    var ordersObj = new Orders(orders);

    // Save the Orders
    ordersObj.save(function () {
      request(app).get('/api/orders/' + ordersObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', orders.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Orders with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/orders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Orders is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Orders which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Orders
    request(app).get('/api/orders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Orders with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Orders if signed in', function (done) {
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

        // Save a new Orders
        agent.post('/api/prticles')
          .send(orders)
          .expect(200)
          .end(function (ordersSaveErr, ordersSaveRes) {
            // Handle Orders save error
            if (ordersSaveErr) {
              return done(ordersSaveErr);
            }

            // Delete an existing Orders
            agent.delete('/api/orders/' + ordersSaveRes.body._id)
              .send(orders)
              .expect(200)
              .end(function (ordersDeleteErr, ordersDeleteRes) {
                // Handle Orders error error
                if (ordersDeleteErr) {
                  return done(ordersDeleteErr);
                }

                // Set assertions
                (ordersDeleteRes.body._id).should.equal(ordersSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an orders if not signed in', function (done) {
    // Set article user
    orders.user = user;

    // Create new orders model instance
    var ordersObj = new Orders(orders);

    // Save the article
    ordersObj.save(function () {
      // Try deleting orders
      request(app).delete('/api/orders/' + ordersObj._id)
        .expect(403)
        .end(function (ordersDeleteErr, ordersDeleteRes) {
          // Set message assertion
          (ordersDeleteRes.body.message).should.match('User is not authorized');

          // Handle orders error error
          done(ordersDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Orders.remove().exec(done);
    });
  });
});
