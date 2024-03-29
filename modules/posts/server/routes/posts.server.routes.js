'use strict';

/**
 * Module dependencies.
 */
var postsPolicy = require('../policies/posts.server.policy');
var posts = require('../controllers/posts.server.controller');

module.exports = function (app) {
  // Posts collection routes
  app.route('/api/posts').all(postsPolicy.isAllowed)
    .get(posts.list)
    .post(posts.create);

  // Single post routes
  app.route('/api/posts/:postId').all(postsPolicy.isAllowed)
    .get(posts.read)
    .put(posts.update)
    .delete(posts.delete);

  // Single post routes
  app.route('/api/posts/:postId/edit').all(postsPolicy.isAllowed)
      .get(posts.read)
      .put(posts.update)
      .delete(posts.delete);

  // Finish by binding the post middleware
  app.param('postId', posts.postByID);
};
