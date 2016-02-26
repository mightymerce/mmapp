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
  //app.route('/api/products/getetsytoken').get(products.getEtsyOAuth());
  // Dawanda connection routes
  //app.route('/api/users/auth/getdawanda').get(users.getDawandaOAuth);

  // Twitter connection routes
  app.route('/api/users/twitter/twitterGetOAuthToken/:productId').get(users.twitterGetOAuthToken);
  app.route('/api/users/twitter/twitterGetAccessToken/:oauth_verifier/:oauth_token').get(users.twitterGetAccessToken);
  app.route('/api/users/twitter/twitterVerifyCredentials/:oauth_AccessToken/:oauth_AccessTokenSecret').get(users.twitterVerifyCredentials);
  app.route('/api/users/twitter/twitterTweetStatus/:oauth_AccessToken/:oauth_AccessTokenSecret/:tweetStatus/:productid').get(users.twitterTweetStatus);

  // Instagram connection routes
  app.route('/api/users/instagram/instagramGetAccessToken/:oauth_code/:callback_uri').get(users.instagramGetAccessToken);

};
