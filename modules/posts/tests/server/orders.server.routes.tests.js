'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Channels = mongoose.model('Channels'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, channels;

/**
 * Channels routes tests
 */
describe('Channels CRUD tests', function () {

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

    // Save a user to the test db and create new channels
    user.save(function () {
      channels = {
        title: 'Channels Title',
        content: 'Channels Content'
      };

      done();
    });
  });

  it('should be able to save an channels if logged in', function (done) {
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
        agent.post('/api/channels')
          .send(channels)
          .expect(200)
          .end(function (channelsSaveErr, channelsSaveRes) {
            // Handle Channels save error
            if (channelsSaveErr) {
              return done(channelsSaveErr);
            }

            // Get a list of articles
            agent.get('/api/channels')
              .end(function (channelsGetErr, channelsGetRes) {
                // Handle article save error
                if (channelsGetErr) {
                  return done(channelsGetErr);
                }

                // Get articles list
                var articles = channelsGetRes.body;

                // Set assertions
                (articles[0].user._id).should.equal(userId);
                (articles[0].title).should.match('Channels Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an channels if not logged in', function (done) {
    agent.post('/api/channels')
      .send(channels)
      .expect(403)
      .end(function (channelsSaveErr, channelsSaveRes) {
        // Call the assertion callback
        done(channelsSaveErr);
      });
  });

  it('should not be able to save an channels if no title is provided', function (done) {
    // Invalidate title field
    channels.title = '';

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
        agent.post('/api/channels')
          .send(channels)
          .expect(400)
          .end(function (channelsSaveErr, channelsSaveRes) {
            // Set message assertion
            (channelsSaveRes.body.message).should.match('Title cannot be blank');

            // Handle article save error
            done(channelsSaveErr);
          });
      });
  });

  it('should be able to update an channels if signed in', function (done) {
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
        agent.post('/api/channels')
          .send(channels)
          .expect(200)
          .end(function (channelsSaveErr, channelsSaveRes) {
            // Handle channels save error
            if (channelsSaveErr) {
              return done(channelsSaveErr);
            }

            // Update channels title
            channels.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing article
            agent.put('/api/channels/' + channelsSaveRes.body._id)
              .send(channels)
              .expect(200)
              .end(function (channelsUpdateErr, channelsUpdateRes) {
                // Handle channels update error
                if (channelsUpdateErr) {
                  return done(channelsUpdateErr);
                }

                // Set assertions
                (channelsUpdateRes.body._id).should.equal(channelsSaveRes.body._id);
                (channelsUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Channels if not signed in', function (done) {
    // Create new Channels model instance
    var channelsObj = new Channels(channels);

    // Save the Channels
    channelsObj.save(function () {
      // Request Channels
      request(app).get('/api/channels')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Channels if not signed in', function (done) {
    // Create new Channels model instance
    var channelsObj = new Channels(channels);

    // Save the Channels
    channelsObj.save(function () {
      request(app).get('/api/channels/' + channelsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', channels.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Channels with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/channels/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Channels is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Channels which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Channels
    request(app).get('/api/channels/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Channels with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Channels if signed in', function (done) {
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

        // Save a new Channels
        agent.post('/api/prticles')
          .send(channels)
          .expect(200)
          .end(function (channelsSaveErr, channelsSaveRes) {
            // Handle Channels save error
            if (channelsSaveErr) {
              return done(channelsSaveErr);
            }

            // Delete an existing Channels
            agent.delete('/api/channels/' + channelsSaveRes.body._id)
              .send(channels)
              .expect(200)
              .end(function (channelsDeleteErr, channelsDeleteRes) {
                // Handle Channels error error
                if (channelsDeleteErr) {
                  return done(channelsDeleteErr);
                }

                // Set assertions
                (channelsDeleteRes.body._id).should.equal(channelsSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an channels if not signed in', function (done) {
    // Set article user
    channels.user = user;

    // Create new channels model instance
    var channelsObj = new Channels(channels);

    // Save the article
    channelsObj.save(function () {
      // Try deleting channels
      request(app).delete('/api/channels/' + channelsObj._id)
        .expect(403)
        .end(function (channelsDeleteErr, channelsDeleteRes) {
          // Set message assertion
          (channelsDeleteRes.body.message).should.match('User is not authorized');

          // Handle channels error error
          done(channelsDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Channels.remove().exec(done);
    });
  });
});
