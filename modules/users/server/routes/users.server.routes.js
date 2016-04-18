'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var deliverys = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/productpicture').post(users.uploadProductImage);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
  app.param('activateURL', users.userByActivateURL);

  // Paypal checkout routes
  app.route('/api/users/stripeCreateSubscription/:USER/:PLAN/:TOKEN').get(users.stripeCreateSubscription);
  app.route('/api/users/stripeUpdateSubscription/:CUSID/:SUBID/:PLAN').get(users.stripeUpdateSubscription);
  app.route('/api/users/stripeCancelSubscription/:CUSID/:SUBID').get(users.stripeCancelSubscription);

  // Etsy connection routes
  app.route('/api/users/etsy/etsyGetOAuthToken/:productId').get(users.etsyGetOAuthToken);
  app.route('/api/users/etsy/etsyGetAccessToken/:oauth_verifier/:oauth_token/:oauth_token_secret').get(users.etsyGetAccessToken);
  app.route('/api/users/etsy/etsyGetMyProducts/:oauth_AccessToken/:oauth_AccessTokenSecret').get(users.etsyGetMyProducts);

  // Dawanda connection routes
  app.route('/api/users/dawanda/dawandaGetOAuthToken/:productId').get(users.dawandaGetOAuthToken);
  app.route('/api/users/dawanda/dawandaGetAccessToken/:oauth_verifier/:oauth_token').get(users.dawandaGetAccessToken);
  app.route('/api/users/dawanda/dawandaGetMyProducts/:oauth_AccessToken/:oauth_AccessTokenSecret').get(users.dawandaGetMyProducts);

  // Twitter connection routes
  app.route('/api/users/twitter/twitterGetOAuthToken/:productId').get(users.twitterGetOAuthToken);
  app.route('/api/users/twitter/twitterGetAccessToken/:oauth_verifier/:oauth_token').get(users.twitterGetAccessToken);
  app.route('/api/users/twitter/twitterVerifyCredentials/:oauth_AccessToken/:oauth_AccessTokenSecret').get(users.twitterVerifyCredentials);
  app.route('/api/users/twitter/twitterTweetStatus/:oauth_AccessToken/:oauth_AccessTokenSecret/:tweetStatus/:productid').get(users.twitterTweetStatus);

  // Instagram connection routes
  app.route('/api/users/instagram/instagramGetAccessToken/:oauth_code/:callback_uri').get(users.instagramGetAccessToken);
  app.route('/api/users/instagram/instagramGetMedia/:access_token').get(users.instagramGetMedia);
  app.route('/api/users/instagram/instagramPostComment/:access_token/:instagramComment/:productid/:mediaid').get(users.instagramPostComment);
};
