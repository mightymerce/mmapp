'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  crypto = require('crypto'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Delivery = mongoose.model('Delivery'),
  https = require('https'),
  http = require("http"),
  urlParser = require('url'),
  Twitter = require('twitter');

var stripe = require('stripe')('sk_test_AYQBhWDR55fPPfUnYCqa9hSm');
var oauthSignature = require('oauth-signature');

var ig = require('instagram-node').instagram();

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  console.log('users.profile.server.controller - update - start');
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    // user.displayName = user.firstName + ' ' + user.lastName;

    console.log('users.profile.server.controller - update - user exist: ' +user._id);
    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('users.profile.server.controller - update - success update');
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


/**
 * Update profile picture
 */
exports.uploadProductImage = function (req, res) {
  var user = req.user;
  var message = null;

  var storage = multer.diskStorage({
    destination: './modules/products/client/img/products/uploads/',
    filename: function (req, file, cb) {
      var fileExtension = '';
      if (file.mimetype === 'image/png') {
        fileExtension = '.png';
      }
      if (file.mimetype === 'image/jpg') {
        fileExtension = '.jpg';
      }
      if (file.mimetype === 'image/jpeg') {
        fileExtension = '.jpeg';
      }
      if (file.mimetype === 'image/gif') {
        fileExtension = '.gif';
      }

      crypto.pseudoRandomBytes(8, function (err, raw) {
        if (err)
          return cb(err);
        cb(null, 'product-mightymerce-' + raw.toString('hex') + fileExtension);
      });
    }
  });

  var upload = multer({ storage: storage }).single('productImageMainUpload');

  // Original:
  // var upload = multer(config.uploads.productImageUpload).single('productImageMainUpload');

  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        res.json(config.uploads.productImageUpload.dest + req.file.filename);
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

/**
 * Send User
 */
exports.read = function (req, res) {
  res.json(req.user || null);
};

/**
 * Stripe subscription
 */
exports.stripeCreateSubscription = function (req, res) {
  console.log('users.profile.server.controller - stripeCreateSubscription - start');

  // (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
  var stripeToken = req.params.TOKENID;

  stripe.customers.create({
    source: stripeToken, // obtained with Stripe.js
    plan: req.params.PLAN,
    email: req.params.USER
  }, function(err, customer) {
    // asynchronously called
    // Check token and details.
    if(err){
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          err.message; // => e.g. "Your card's expiration year is invalid."
          break;
        case 'RateLimitError':
          // Too many requests made to the API too quickly
          break;
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          break;
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          break;
        case 'StripeConnectionError':
          // Some kind of error occurred during the HTTPS communication
          break;
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          break;
        default:
          // Handle any other types of unexpected errors
          break;
      }
    } else {
      // SUCCESS SUBSCRIPTION
      var resObj = JSON.stringify(customer);
      res.send(customer);
    }
  });
};


/**
 * Stripe update subscription
 */
exports.stripeUpdateSubscription = function (req, res) {
  console.log('users.profile.server.controller - stripeUpdateSubscription - start');

  stripe.customers.updateSubscription(
      req.params.CUSID,
      req.params.SUBID,
    { plan: req.params.PLAN }, function(err, customer) {
    // asynchronously called
    // Check token and details.
    if(err){
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          err.message; // => e.g. "Your card's expiration year is invalid."
          break;
        case 'RateLimitError':
          // Too many requests made to the API too quickly
          break;
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          break;
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          break;
        case 'StripeConnectionError':
          // Some kind of error occurred during the HTTPS communication
          break;
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          break;
        default:
          // Handle any other types of unexpected errors
          break;
      }
    } else {
      // SUCCESS SUBSCRIPTION
      var resObj = JSON.stringify(customer);
      res.send(customer);
    }
  });
};

/**
 * Stripe cancel subscription
 */
exports.stripeCancelSubscription = function (req, res) {
  console.log('users.profile.server.controller - stripeUpdateSubscription - start');


  stripe.customers.cancelSubscription(
      req.params.CUSID,
      req.params.SUBID,
      function(err, confirmation) {
        // asynchronously called
        // Check token and details.
        if(err){
          switch (err.type) {
            case 'StripeCardError':
              // A declined card error
              err.message; // => e.g. "Your card's expiration year is invalid."
              break;
            case 'RateLimitError':
              // Too many requests made to the API too quickly
              break;
            case 'StripeInvalidRequestError':
              // Invalid parameters were supplied to Stripe's API
              break;
            case 'StripeAPIError':
              // An error occurred internally with Stripe's API
              break;
            case 'StripeConnectionError':
              // Some kind of error occurred during the HTTPS communication
              break;
            case 'StripeAuthenticationError':
              // You probably used an incorrect API key
              break;
            default:
              // Handle any other types of unexpected errors
              break;
          }
        } else {
          // SUCCESS SUBSCRIPTION
          var resObj = JSON.stringify(confirmation);
          res.send(customer);
        }
      });
};

/**
 * Stripe create cc token
 */
exports.stripeCreateCCToken = function (req, res) {
  console.log('users.profile.server.controller - stripeCreateCCToken - start');

  var stripe = require('stripe')('sk_test_AYQBhWDR55fPPfUnYCqa9hSm');

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
  var stripeToken = req.body.stripeToken;

  stripe.customers.create({
    source: stripeToken,
    description: 'Sie haben ihre Informationen bei mightymerce eingegeben.'
  }).then(function(customer) {
    return stripe.charges.create({
      amount: 0, // amount in cents, again
      currency: 'eur',
      customer: customer.id
    });
  }).then(function(charge) {
    // YOUR CODE: Save the customer ID and other info in a database for later!
    //console.log(JSON.stringify(charge));

    var user = req.user;

    if (user) {
      // Merge existing user
      user = _.extend(user, req.body);
      user.customerIdSt = charge.customer.id;

      user.updated = Date.now();
      // user.displayName = user.firstName + ' ' + user.lastName;

      console.log('users.profile.server.controller - update - user exist: ' +user._id);
      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log('users.profile.server.controller - update - success update');
          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.json(user);
            }
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'User is not signed in'
      });
    }
  });

// YOUR CODE: When it's time to charge the customer again, retrieve the customer ID!

  /*
  stripe.charges.create({
    amount: 100, // amount in cents, again
    currency: "eur",
    customer: customerId // Previously stored, then retrieved
  });
  */
};


/**
 * Stripe create cc token
 */
exports.stripeCreateMonthlyDebit = function (req, res) {
  console.log('users.profile.server.controller - stripeCreateMonthlyDebit - start');

  var stripe = require('stripe')('sk_test_AYQBhWDR55fPPfUnYCqa9hSm');

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
  var charge = req.params.CHARGE;
  var customerId = req.params.CUSID;

  // YOUR CODE: When it's time to charge the customer again, retrieve the customer ID!

  stripe.charges.create({
    amount: charge, // amount in cents, again
    currency: "eur",
    customer: customerId // Previously stored, then retrieved
  });
};

/**
 * Twitter get OAuthToken
 */
exports.twitterGetOAuthToken = function (req, res) {
  console.log('users.profile.server.controller - twitterGetOAuthToken - start');

  var request = require('request');
  var qs = require('querystring');

  var callback_url = req.protocol + "://" + req.get('host') + '/products/' + req.params.productId + '/view';
  var oauth =
      {
        callback: callback_url,
        consumer_key: 'OJ6s65TtbW0tJKHiWi9CsdoAt',
        consumer_secret: 'OOKHG8B29mgZvcrPdOzEUlTn8wkSfd4AfEnJdYZZh9imcv48RP'

      };
  var url = 'https://api.twitter.com/oauth/request_token';

  request.post({
    url: url,
    oauth: oauth
  }, function (e, r, body) {
    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.

    var req_data = qs.parse(body);
    res.json(req_data.oauth_token);
  });

};

/**
 * Twitter get AccessToken
 */
exports.twitterGetAccessToken = function (req, res) {
  console.log('users.profile.server.controller - twitterGetAccessToken - start');

  var request = require('request');
  var qs = require('querystring');
  var oauth =
  {
    token: req.params.oauth_token,
    verifier: req.params.oauth_verifier
  };
  var url = 'https://api.twitter.com/oauth/access_token';

  request.post({
    url: url,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      return console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r.statusText);
    }

    var req_data = qs.parse(body);
    res.json(req_data);
  });

};

/**
 * Twitter Verify credentials
 */
exports.twitterVerifyCredentials = function (req, res) {
  console.log('users.profile.server.controller - twitterVerifyCredentials - start');

  var request = require('request');
  var qs = require('querystring');
  var oauth =
  {
    consumer_key: 'OJ6s65TtbW0tJKHiWi9CsdoAt',
    consumer_secret: 'OOKHG8B29mgZvcrPdOzEUlTn8wkSfd4AfEnJdYZZh9imcv48RP',
    token: req.params.oauth_AccessToken,
    token_secret: req.params.oauth_AccessTokenSecret
  };
  var url = 'https://api.twitter.com/1.1/account/verify_credentials.json';

  request.get({
    url: url,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      console.log('users.profile.server.controller - twitterVerifyCredentials - error ');
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('users.profile.server.controller - twitterVerifyCredentials - Error: ' +'code: ' + r.statusCode + ' - message: ' + r.statusText);
      res.json('code: ' + r.statusCode + ' - ' + r.statusText);
    }
    else {
      console.log('users.profile.server.controller - twitterVerifyCredentials - success ');
      res.json('valid');
    }
  });

};



/**
 * Twitter get tweetStatus
 */
exports.twitterTweetStatus = function (req, res) {
  console.log('users.profile.server.controller - twitterTweetStatus - start');

  var nonceValue = crypto.randomBytes(Math.ceil(32 * 3 / 4))
      .toString('base64')   // convert to base64 format
      .slice(0, 32)        // return required number of characters
      .replace(/\+/g, '0')  // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'

  var timestampValue = Math.floor(new Date() / 1000);

  var request = require('request');
  var qs = require('querystring');
  var params =
  {
    consumer_key: 'OJ6s65TtbW0tJKHiWi9CsdoAt',
    nonce: timestampValue,
    signature_method: 'HMAC-SHA1',
    timestamp: timestampValue,
    version: '1.0',
    token: req.params.oauth_AccessToken
  };
  var url = 'https://api.twitter.com/1.1/statuses/update.json';

  var signatureOAuth = oauthSignature.generate('POST', url, params,'OOKHG8B29mgZvcrPdOzEUlTn8wkSfd4AfEnJdYZZh9imcv48RP',req.params.oauth_AccessTokenSecret);

  var oauth =
  {
    consumer_key: 'OJ6s65TtbW0tJKHiWi9CsdoAt',
    nonce: timestampValue,
    signature_method: 'HMAC-SHA1',
    timestamp: timestampValue,
    version: '1.0',
    signature: signatureOAuth,
    token: req.params.oauth_AccessToken
    //consumer_secret: 'OOKHG8B29mgZvcrPdOzEUlTn8wkSfd4AfEnJdYZZh9imcv48RP',
    //token_secret: req.params.oauth_AccessTokenSecret

  };

  var client = new Twitter({
    consumer_key: 'OJ6s65TtbW0tJKHiWi9CsdoAt',
    consumer_secret: 'OOKHG8B29mgZvcrPdOzEUlTn8wkSfd4AfEnJdYZZh9imcv48RP',
    access_token_key: req.params.oauth_AccessToken,
    access_token_secret: req.params.oauth_AccessTokenSecret,
  });

  var statusTweetURL = req.protocol + "://" + req.get('host') + '/checkouts/' + req.params.productid + '?channel=twitter';

  console.log('users.profile.server.controller - twitterTweetStatus - response: ' + statusTweetURL);

  client.post('statuses/update', {status: req.params.tweetStatus + ' ' + statusTweetURL},  function(error, tweet, response){
    if(error){
      console.log('users.profile.server.controller - twitterTweetStatus - error: ' + error);
      return 'Error:' + error;
    }

    //Check for right status code
    if(response.statusCode !== 200){
      console.log('users.profile.server.controller - twitterTweetStatus - Error: ' +'code: ' + response.statusCode + ' - message: ' + response.status);
      res.status(response.statusCode).send({
        message: 'Code: ' + response.statusCode
      });
    }
    else {
      console.log('users.profile.server.controller - twitterTweetStatus - success ');
      console.log(tweet);
      var resObj = JSON.stringify(tweet);
      res.json(tweet);
    }

  });
};

/**
 ** Instagram get AccessToken
 */
exports.instagramGetAccessToken = function (req, res) {
  console.log('users.profile.server.controller - instagramGetAccessToken - start');

  ig.use({ client_id: '15005e14881a44b7a3021a6e63ca3e04',
    client_secret: '6ec00b3abfdb4b9ab8fd3ae305226af2' });

  var request = require('request');
  var qs = require('querystring');

  var url = 'https://api.instagram.com/oauth/access_token';
  var callback_url = req.protocol + "://" + req.get('host') + '/products?this=' + req.params.callback_uri;

  console.log('users.profile.server.controller - instagramGetAccessToken - callback_uri: ' + callback_url);
  console.log('users.profile.server.controller - instagramGetAccessToken - code: ' + req.params.oauth_code);


  ig.authorize_user(req.params.oauth_code, callback_url, function(err, result) {
    if (err) {
      console.log('users.profile.server.controller - instagramGetAccessToken - error: ' + err.body);
      res.send(err);
    } else {
      res.json(result);
    }
  });
};


/**
 ** Instagram get Media
 */
exports.instagramGetMedia = function (req, res) {
  console.log('users.profile.server.controller - instagramGetMedia - start');

  ig.use({ access_token: req.params.access_token });

  /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
  ig.user_self_media_recent(10, function(err, medias, pagination, remaining, limit) {
    if (err) {
      console.log('users.profile.server.controller - instagramGetMedia - error: ' + err.body);
      res.send(err);
    } else {
      console.log('users.profile.server.controller - instagramGetMedia - success');
      res.json(medias);
    }
  });
};


var GoogleUrl = require( 'google-url' );

/**
 ** Instagram add comment
 */
exports.instagramPostComment = function (req, res) {
  console.log('users.profile.server.controller - instagramPostComment - start');

  var statusTweetURL = req.protocol + "://" + req.get('host') + '/checkouts/' + req.params.productid + '?channel=instagram';

  var googleUrl = new GoogleUrl( { key: 'AIzaSyCfNzUm830f5cRqiYu9GxtKpUK46OD4uk4' });
  googleUrl.shorten( statusTweetURL, function( err, shortUrl ) {

    var comment = req.params.instagramComment + shortUrl;
    //var comment = req.params.instagramComment + statusTweetURL;

    console.log('users.profile.server.controller - instagramPostComment - comment: '+comment);

    ig.use({ access_token: req.params.access_token });

    /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
    ig.add_comment(req.params.mediaid, comment, function(err, result, remaining, limit) {
      if (err) {
        console.log('users.profile.server.controller - instagramPostComment - error: ' + err.body);
        res.send(err);
      } else {
        console.log('users.profile.server.controller - instagramPostComment - success');
        res.json('success');
      }
    });
  })
};


/**
 * Dawanda get oauthtoken
 */
exports.dawandaGetOAuthToken = function (req, res) {
  console.log('users.profile.server.controller - dawandaGetOAuthToken - start');

  var request = require('request');
  var qs = require('querystring');

  var callback_url = req.protocol + "://" + req.get('host') + '/products/' + req.params.productId + '/editchannel';
  var oauth =
  {
    callback: callback_url,
    consumer_key: 'OnKajypXQtvwLe9LzzyT',
    consumer_secret: 'q7FoM4VW5yprPq8v7e9bJUqiU99oYzagTkEqGCQ7'

  };
  var url = 'http://de.dawanda.com/oauth/request_token';

  request.post({
    url: url,
    oauth: oauth
  }, function (e, r, body) {
    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.

    var req_data = qs.parse(body);
    res.json(req_data.oauth_token);
  });

};


/**
 * Dawanda get AccessToken
 */
exports.dawandaGetAccessToken = function (req, res) {
  console.log('users.profile.server.controller - dawandaGetAccessToken - start');

  var request = require('request');
  var qs = require('querystring');
  var oauth =
  {
    token: req.params.oauth_token,
    verifier: req.params.oauth_verifier
  };
  var url = 'http://de.dawanda.com/oauth/access_token';

  request.post({
    url: url,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      return console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r.statusText);
    }

    var req_data = qs.parse(body);
    res.json(req_data);
  });

};

/**
 * Dawanda getMyProducts
 */
exports.dawandaGetMyProducts = function (req, res) {
  console.log('users.profile.server.controller - dawandaGetMyProducts - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  var oauth =
  {
    //consumer_key: req.params.oauth_AccessToken,
    consumer_key: req.params.oauth_AccessToken,
    nonce: timestampValue,
    timestamp: timestampValue,
    version:1.1
  };

  var url = 'https://dawanda.com/seller_api/products?v=1.1';


  var params =
  {
    signature_method: 'HMAC-SHA1',
    offset: 0,
    limit: 200,
    'X-Dawanda-Auth': 'be2f1b59af546199f79d63b1e1f3018301f5cdc5'
  };

  request.get({
    url: url,
    headers:params,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
    }

    var req_data = qs.parse(body);
    res.json(r);
  });

};

/**
 * Dawanda getSelectedProduct
 */
exports.dawandaGetSelectedProduct = function (req, res) {
  console.log('users.profile.server.controller - dawandaGetSelectedProduct - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  var oauth =
  {
    //consumer_key: req.params.oauth_AccessToken,
    consumer_key: req.params.dawandaproductId,
    nonce: timestampValue,
    timestamp: timestampValue,
    version:1.1
  };


  var url = 'http://en.dawanda.com/api/v1/products/' + req.params.dawandaproductId + '.json?api_key=be2f1b59af546199f79d63b1e1f3018301f5cdc5';
  //var url = 'https://dawanda.com/seller_api/45041458?v=1.1';


  var params =
  {
    signature_method: 'HMAC-SHA1',
    offset: 0,
    limit: 200,
    'X-Dawanda-Auth': 'be2f1b59af546199f79d63b1e1f3018301f5cdc5'
  };

  request.get({
    url: url,
    headers:params,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
    }

    //var req_data = qs.parse(body);
    //console.log('body: ' + body);
    //console.log('qs.parse(body): ' + qs.parse(body));
    //console.log('json: ' + body.JSON);
    res.json(body);
  });

};

/**
 * Etsy getSelectedProduct
 */
exports.etsyGetSelectedProduct = function (req, res) {
  console.log('users.profile.server.controller - etsyGetSelectedProduct - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  var oauth =
  {
    //consumer_key: req.params.oauth_AccessToken,
    //consumer_key: req.params.etsyproductId,
    nonce: timestampValue,
    timestamp: timestampValue,
    version:1.1
  };

  var url = 'https://openapi.etsy.com/v2/listings/' + req.params.etsyproductId + '?language=de&api_key=hwvqyaq0k013gq6bkz8lc38x';
  console.log('users.profile.server.controller - etsyGetSelectedProduct - uri: ' + url);

  var params =
  {
    signature_method: 'HMAC-SHA1',
    offset: 0,
    limit: 200,
    //'X-Dawanda-Auth': 'be2f1b59af546199f79d63b1e1f3018301f5cdc5'
  };

  request.get({
    url: url,
    headers:params,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
    }

    //var req_data = qs.parse(body);
    //console.log('body: ' + body);
    //console.log('qs.parse(body): ' + qs.parse(body));
    //console.log('json: ' + r.JSON);
    res.json(r);
  });

};

/**
 * Etsy getSelectedProduct
 */
exports.etsyGetSelectedProductImages = function (req, res) {
  console.log('users.profile.server.controller - etsyGetSelectedProductImages - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  var oauth =
  {
    //consumer_key: req.params.oauth_AccessToken,
    //consumer_key: req.params.etsyproductId,
    nonce: timestampValue,
    timestamp: timestampValue,
    version:1.1
  };

  var url = 'https://openapi.etsy.com/v2/listings/' + req.params.etsyproductId + '/images?api_key=hwvqyaq0k013gq6bkz8lc38x';
  console.log('users.profile.server.controller - etsyGetSelectedProductImages - uri: ' + url);

  var params =
  {
    signature_method: 'HMAC-SHA1',
    offset: 0,
    limit: 200,
    //'X-Dawanda-Auth': 'be2f1b59af546199f79d63b1e1f3018301f5cdc5'
  };

  request.get({
    url: url,
    headers:params,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
    }

    //var req_data = qs.parse(body);
    //console.log('body: ' + body);
    //console.log('qs.parse(body): ' + qs.parse(body));
    //console.log('json: ' + r.JSON);
    res.json(r);
  });

};

/**
 * Etsy get oauthtoken
 */
exports.etsyGetOAuthToken = function (req, res) {
  console.log('users.profile.server.controller - etsyGetOAuthToken - start');

  var request = require('request');
  var qs = require('querystring');

  var callback_url = req.protocol + "://" + req.get('host') + '/products/' + req.params.productId + '/editetsy';
  var oauth =
  {
    callback: callback_url,
    consumer_key: 'hwvqyaq0k013gq6bkz8lc38x',
    consumer_secret: 'ovdktra6f4'

  };
  var url = 'https://openapi.etsy.com/v2/oauth/request_token?scope=email_r%20listings_r%20listings_w%20transactions_r%20transactions_w';

  request.post({
    url: url,
    oauth: oauth
  }, function (e, r, body) {
    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.

    var req_data = qs.parse(body);
    res.json(req_data);
  });

};


/**
 * Etsy get AccessToken
 */
exports.etsyGetAccessToken = function (req, res) {
  console.log('users.profile.server.controller - etsyGetAccessToken - start');

  var request = require('request');
  var qs = require('querystring');
  var oauth =
  {
    consumer_key: 'hwvqyaq0k013gq6bkz8lc38x',
    consumer_secret: 'ovdktra6f4',
    token: req.params.oauth_token,
    token_secret: req.params.oauth_token_secret,
    verifier: req.params.oauth_verifier
  };
  var url = 'https://openapi.etsy.com/v2/oauth/access_token';

  request.post({
    url: url,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r.statusText);
      res.json(r);
    }
    else {
      var req_data = qs.parse(body);
      res.json(req_data);
    }
  });
};


/**
 * Etsy getMyProducts
 */
exports.etsyGetMyProducts = function (req, res) {
  console.log('users.profile.server.controller - etsyGetMyProducts - start');

  var request = require('request');
  var qs = require('querystring');
  var timestampValue = Math.floor(new Date() / 1000);
  var oauth =
  {
    consumer_key: 'hwvqyaq0k013gq6bkz8lc38x',
    consumer_secret: 'ovdktra6f4',
    signature_method: 'HMAC-SHA1',
    token: req.params.oauth_AccessToken,
    token_secret: req.params.oauth_AccessTokenSecret
  };

  var url = 'https://openapi.etsy.com/v2/listings/active';

  request.get({
    url: url,
    oauth: oauth
  }, function (error, r, body) {

    // Ideally, you would take the body in the response
    // and construct a URL that a user clicks on (like a sign in button).
    // The verifier is only available in the response after a user has
    // verified with twitter that they are authorizing your app.
    if(error){
      return console.log('Error:', error);
    }

    //Check for right status code
    if(r.statusCode !== 200){
      console.log('Invalid Status Code Returned:', r.statusCode + ' ' + r);
      res.json(r);
    }
    else {
      var req_data = qs.parse(body);
      res.json(req_data);
    }
  });

};


