'use strict';

var nodemailer = require('nodemailer');

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  _ = require('lodash');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.tutorialDeliveryDetail = '1';

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};

/*
 * user middleware by activateID
 * */
exports.userByActivateURL = function(req, res, next) {
  console.log('users.authentication.server.controller - userByActivateURL - start - req.body.activateID: ' +req.query.activateURL);
  User.findOne({
    activateURL: { $eq: req.query.activateURL }
  }, '_id email').exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + req.query.activateURL));
    console.log('users.authentication.server.controller - userByActivateURL - success: ' +user._id);
    return res.json(user);
  });
};


/**
 * Update user details
 */
exports.updateActivateUser = function (req, res, next) {
  // Init Variables
  console.log('users.profile.server.controller - updateActivateUser - start - getUser activateURL: ' +req.query.activateURL);

  User.findOne({
    activateURL: { $eq: req.query.activateURL }
  }, '_id username password email').exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + req.query.activateURL));

    console.log('users.profile.server.controller - updateActivateUser - user exist: ' +req.body);

    if (user) {
      // Merge existing user
      user = _.extend(user, req.body);
      user.updated = Date.now();
      user.displayName = user.firstName + ' ' + user.lastName;
      user.activateURL = '';
      user.userStatus = 'free';

      console.log('users.profile.server.controller - updateActivateUser - user exist: ' +user._id);
      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log('users.profile.server.controller - updateActivateUser - success update');
          return res.json('success');
        }
      });
    } else {
      res.status(400).send({
        message: 'User is not signed in'
      });
    }

  });
};


exports.getDawandaOAuth = function (req, res, next) {
  console.log('products.server.controller - getDawandaOAuth - start');

  var client = require('http');
  var options = {
    host: 'http://de.dawanda.com',
    path: '/api/v1/oauth/request_token',
    api_key: 'OnKajypXQtvwLe9LzzyT',
    api_secret: 'q7FoM4VW5yprPq8v7e9bJUqiU99oYzagTkEqGCQ7',
    country: 'de',
    method: 'GET' //POST,PUT,DELETE etc
  };

  console.log('products.server.controller - getDawandaOAuth - start request');

  //handle request;
  var httpRequest = client.request(options, function(response){
    console.log("Code: "+response.statusCode+ "\n Headers: "+response.headers);
    response.on('data', function (chunk) {
      console.log(chunk);
    });
    response.on('end',function(){
      console.log("\nResponse ended\n");
    });
    response.on('error', function(err){
      console.log("Error Occurred: "+err.message);
    });

  });
};


/**
 * Send activate email
 */
exports.sendactivateemail = function (req, res, next) {

  var rand,host,link,linkcancel;

  rand = Math.floor((Math.random() * 100) + 54);
  host = req.get('host');
  link = 'http://'+req.get('host')+'/authentication/signin?id='+rand;
  linkcancel = 'http://'+req.get('host')+'/authentication/signin?id=cancel'+rand;

  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: true, // use SSL
    auth: {
      user: 'wagner@mightymerce.com',
      pass: 'pufyeytpdejudtfk'
    }
  });

  var inputData = req.body;

  console.log('users.authentication.server.controller - sendactivateemail - start');

  var html = html + '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
  html = html + '	<html xmlns="http://www.w3.org/1999/xhtml">';
  html = html + '	<head>';
  html = html + '	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
  html = html + '	<meta name="viewport" content="width=device-width">';
  html = html + '	<meta name="format-detection" content="address=no;email=no;telephone=no">';
  html = html + '	<title>Welcome to mightymerce</title>';
  html = html + '	<style type="text/css">		';
  html = html + '	/* Modified:30/01/2016 */		';
  html = html + '	/* Global Reset */		';
  html = html + '	body {		';
  html = html + '		-webkit-text-size-adjust: 100%;	';
  html = html + '		-ms-text-size-adjust: 100%;	';
  html = html + '	}		';
  html = html + '	body, p, h1, h2, h3, h4, h5, h6, img, table, td, #emailBody {		';
  html = html + '		margin-top: 0;	';
  html = html + '		margin-left: 0;	';
  html = html + '		margin-right: 0;	';
  html = html + '		margin-bottom: 0;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	a, #outlook a {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		display: inline-block;	';
  html = html + '	}		';
  html = html + '	a, a span {		';
  html = html + '		text-decoration: none;	';
  html = html + '	}		';
  html = html + '	a img {		';
  html = html + '		border: none;	';
  html = html + '	}		';
  html = html + '	img {		';
  html = html + '		height: auto;	';
  html = html + '		width: auto;	';
  html = html + '		line-height: 100%;	';
  html = html + '		outline: none;	';
  html = html + '		text-decoration: none;	';
  html = html + '		-ms-interpolation-mode: bicubic;	';
  html = html + '	}		';
  html = html + '	.imageFix {		';
  html = html + '		display: block;	';
  html = html + '	}		';
  html = html + '	table {		';
  html = html + '		mso-table-lspace: 0pt;	';
  html = html + '		mso-table-rspace: 0pt;	';
  html = html + '	}		';
  html = html + '	table, td {		';
  html = html + '		border-collapse: collapse;	';
  html = html + '		border-spacing: 0;	';
  html = html + '	}		';
  html = html + '	.ExternalClass {		';
  html = html + '		display: block !important;	';
  html = html + '		width: 100%;	';
  html = html + '	}		';
  html = html + '	.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {		';
  html = html + '		line-height: 100%;	';
  html = html + '	}		';
  html = html + '	.ReadMsgBody, .ExternalClass {		';
  html = html + '		width: 100%;	';
  html = html + '	}		';
  html = html + '	/* Default Typography */		';
  html = html + '	td, th, p, a, li, h1, h2, h3, h4, h5, h6 {		';
  html = html + '		-webkit-text-size-adjust : none;	';
  html = html + '		font-family: Arial, Helvetica, sans-serif;	';
  html = html + '	}		';
  html = html + '	h1, h2, h3, h4, h5, h6 {		';
  html = html + '		margin-bottom: 5px;	/* Outlook.com default */';
  html = html + '	}		';
  html = html + '	p, p.MsoNormal {		';
  html = html + '		margin-bottom: 24px; /* Outlook.com default */	';
  html = html + '	}		';
  html = html + '	/* Alignment */		';
  html = html + '	.alignCenter, .eBody .alignCenter, .alignCenter p, .eBody.alignCenter p, .eBody .alignCenter p {		';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	table.alignCenter, .alignCenter table, .alignCenter img {		';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	.alignLeft, .eBody .alignLeft, .eBody.alignLeft p, .eBody .alignLeft p, .highlight.alignLeft, .invoiceTable2 .alignLeft {		';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	table.alignLeft, .alignLeft table, .alignLeft img {		';
  html = html + '		margin-left: 0;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	.alignRight, .eBody .alignRight, .eBody.alignRight p, .eBody .alignRight p, .highlight.alignRight, .width132.alignRight, .invoiceTable2 .alignRight {		';
  html = html + '		text-align: right;	';
  html = html + '	}		';
  html = html + '	table.alignRight, .alignRight table, .alignRight a {		';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: 0;	';
  html = html + '	}		';
  html = html + '	/* Visual Help */		';
  html = html + '	.desktopHide {		';
  html = html + '		display: none;	';
  html = html + '		font-size: 0;	';
  html = html + '		max-height: 0;	';
  html = html + '		width: 0;	';
  html = html + '		line-height: 0;	';
  html = html + '		overflow: hidden;	';
  html = html + '		mso-hide: all;	';
  html = html + '	}		';
  html = html + '	/* Email Body */		';
  html = html + '	body, #emailBody, .emailBodyCell {		';
  html = html + '		height: 100%;	';
  html = html + '		width: 100%;	';
  html = html + '		min-height: 1000px;	';
  html = html + '	}		';
  html = html + '	.emailBodyCell {		';
  html = html + '		padding-top: 32px;	';
  html = html + '		padding-bottom: 32px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '	}		';
  html = html + '	/* Summary */		';
  html = html + '	.emailSummary {		';
  html = html + '		display: none !important;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		max-height: 0 !important;	';
  html = html + '		line-height: 0 !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		mso-hide: all;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '		float: none !important;	';
  html = html + '		width: 0 !important;	';
  html = html + '		height: 0 !important;	';
  html = html + '	}		';
  html = html + '	/* Spacing */		';
  html = html + '	.emptyCell, .eBody .emptyCell, .highlight .emptyCell, .eBody .space6, .eBody .space10, .invoiceHead .space6, .eBody .space16, .invoiceHead .space16, .space32, .eBody .space32, .invoiceHead .space32, .emptyCell {		';
  html = html + '		line-height: 0 !important;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	.eBody .space6, .invoiceHead .space6 {		';
  html = html + '		height: 6px;	';
  html = html + '		width: 6px;	';
  html = html + '	}		';
  html = html + '	.eBody .space10, .invoiceHead .space10 {		';
  html = html + '		height: 10px;	';
  html = html + '		width: 10px;	';
  html = html + '	}		';
  html = html + '	.eBody .space16, .invoiceHead .space16 {		';
  html = html + '		height: 16px;	';
  html = html + '		width: 16px;	';
  html = html + '	}		';
  html = html + '	.space32, .eBody .space32, .invoiceHead .space32 {		';
  html = html + '		height: 32px;	';
  html = html + '		width: 16px;	';
  html = html + '	}		';
  html = html + '	.pdTp0, .eBox .pdTp0, .highlight.pdTp0, .eBody.pdTp0, .invoiceTable2 .pdTp0, .invoiceTable2.twcoList .pdTp0 {		';
  html = html + '		padding-top: 0px;	';
  html = html + '	}		';
  html = html + '	.pdTp32, .eBox .pdTp32, .highlight.pdTp32, .eBody.pdTp32, .invoiceTable2 .pdTp32, .invoiceTable2.twcoList .pdTp32 {		';
  html = html + '		padding-top: 32px;	';
  html = html + '	}		';
  html = html + '	.pdBt16, .eBox .pdBt16, .highlight.pdBt16, .eBody.pdBt16, .eBox .pdBt16, .invoiceTable2 .pdBt16, .invoiceTable2.twcoList .pdBt16 {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.pdRg16, .eBox .pdRg16, .highlight.pdRg16, .eBody.pdRg16, .eBox .pdRg16, .invoiceTable2 .pdRg16, .invoiceTable2.twcoList .pdRg16 {		';
  html = html + '		padding-right: 16px;	';
  html = html + '	}		';
  html = html + '	.pdLf16, .eBox .pdLf16, .highlight.pdLf16, .eBody.pdLf16, .invoiceTable2 .pdLf16, .invoiceTable2.twcoList .pdLf16 {		';
  html = html + '		padding-left: 16px;	';
  html = html + '	}		';
  html = html + '	.pdLf0, .eBox .pdLf0, .highlight.pdLf0, .eBody.pdLf0, .invoiceTable2 .pdLf0, .invoiceTable2.twcoList .pdLf0 {		';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	/* Widths */		';
  html = html + '	.width40, .width54, .width64, .width80, .width84, .width116, .width246, .width248, .width132, .width184, .width312, .width380, .width412, .width448, .width458 {		';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.width40 {		';
  html = html + '		width: 40px;	';
  html = html + '	}		';
  html = html + '	.width54 {		';
  html = html + '		width: 54px;	';
  html = html + '	}		';
  html = html + '	.width64 {		';
  html = html + '		width: 64px;	';
  html = html + '	}		';
  html = html + '	.width80 {		';
  html = html + '		width: 80px;	';
  html = html + '	}		';
  html = html + '	.width84 {		';
  html = html + '		width: 84px;	';
  html = html + '	}		';
  html = html + '	.width132 {		';
  html = html + '		width: 132px;	';
  html = html + '	}		';
  html = html + '	.width116 {		';
  html = html + '		width: 116px;	';
  html = html + '	}		';
  html = html + '	.width184 {		';
  html = html + '		width: 184px;	';
  html = html + '	}		';
  html = html + '	.width246 {		';
  html = html + '		width: 246px;	';
  html = html + '	}		';
  html = html + '	.width248 {		';
  html = html + '		width: 248px;	';
  html = html + '	}		';
  html = html + '	.width312 {		';
  html = html + '		width: 312px;	';
  html = html + '	}		';
  html = html + '	.width380 {		';
  html = html + '		width: 380px;	';
  html = html + '	}		';
  html = html + '	.width412 {		';
  html = html + '		width: 412px;	';
  html = html + '	}		';
  html = html + '	.width448 {		';
  html = html + '		width: 448px;	';
  html = html + '	}		';
  html = html + '	.width458 {		';
  html = html + '		width: 458px;	';
  html = html + '	}		';
  html = html + '	/* Email Container */		';
  html = html + '	.eBox {		';
  html = html + '		width: 544px;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	.bottomCorners {		';
  html = html + '		width: 544px;	';
  html = html + '	}		';
  html = html + '	.bottomCorners {		';
  html = html + '		height: 16px;	';
  html = html + '	}		';
  html = html + '	/* General Button Style */		';
  html = html + '	.eBox .btnMain {		';
  html = html + '		padding-right: 22px;	';
  html = html + '		padding-left: 22px;	';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-bottom: 12px;	';
  html = html + '		height: 20px;	';
  html = html + '		font-size: 18px;	';
  html = html + '		line-height: 20px;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		text-align: center;	';
  html = html + '		vertical-align: middle;	';
  html = html + '	}		';
  html = html + '	/* Main Button */		';
  html = html + '	.mainBtn td {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.mainBtn a {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	/* Light Button */		';
  html = html + '	.lightBtn td {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.lightBtn a {		';
  html = html + '		font-weight: bold;	';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	/* Sublte Button */		';
  html = html + '	.subtleBtn td {		';
  html = html + '		padding-top: 16px;	';
  html = html + '		padding-bottom: 32px;	';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	/* Options Button */		';
  html = html + '	.optionsButton {		';
  html = html + '		width: 152px;	';
  html = html + '		margin-left: auto;	';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnMain {		';
  html = html + '		padding-top: 5px;	';
  html = html + '		padding-bottom: 5px;	';
  html = html + '		padding-left: 6px;	';
  html = html + '		padding-right: 6px;	';
  html = html + '		height: 16px;	';
  html = html + '		line-height: 16px;	';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnMain a, .optionsButton .btnMain span {		';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnIcon {		';
  html = html + '		width: 16px;	';
  html = html + '		height: 16px;	';
  html = html + '		text-align: center;	';
  html = html + '		vertical-align: middle;	';
  html = html + '		padding-top: 5px;	';
  html = html + '		padding-bottom: 5px;	';
  html = html + '		padding-left: 6px;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnIcon img {		';
  html = html + '		width: 16px;	';
  html = html + '		height: 16px;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnIcon a, .optionsButton .btnIcon img {		';
  html = html + '		margin-top: auto;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '		margin-bottom: auto;	';
  html = html + '	}		';
  html = html + '	/* Tag */		';
  html = html + '	.tag .tagName {		';
  html = html + '		font-size: 11px;	';
  html = html + '		text-transform: uppercase;	';
  html = html + '		padding-left: 6px;	';
  html = html + '		padding-right: 6px;	';
  html = html + '		padding-top: 4px;	';
  html = html + '		padding-bottom: 4px;	';
  html = html + '		white-space: nowrap;	';
  html = html + '	}		';
  html = html + '	.tag .tag_space {		';
  html = html + '		background-color: transparent;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		line-height: 100%;	';
  html = html + '		height: 4px;	';
  html = html + '		text-align: left;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	/* Sections */		';
  html = html + '	.eHeader, .highlight, .eBody {		';
  html = html + '		width: 512px;	';
  html = html + '	}		';
  html = html + '	.highlight, .eBody {		';
  html = html + '		padding-top: 16px;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '	}		';
  html = html + '	/* Header */		';
  html = html + '	.eHeader {		';
  html = html + '		padding-top: 16px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo, .eHeaderOptions {		';
  html = html + '		height: 48px;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo, .eHeaderLogo a {		';
  html = html + '		height: 48px;	';
  html = html + '		text-align: left;	';
  html = html + '		font-size: 18px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo a {		';
  html = html + '		line-height: 0;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo img {		';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogoText {		';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '		padding-top: 10px;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogoText a {		';
  html = html + '		text-align: left;	';
  html = html + '		font-size: 26px;	';
  html = html + '		line-height: 32px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.eHeaderOptions {		';
  html = html + '		text-align: right;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	/* Footer */		';
  html = html + '	.eFooter {		';
  html = html + '		text-align: center;	';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 21px;	';
  html = html + '		padding-top: 14px;	';
  html = html + '		width: 544px;	';
  html = html + '	}		';
  html = html + '	.eFooter a, .eFooter a span {		';
  html = html + '		text-decoration: underline;	';
  html = html + '	}		';
  html = html + '	.eFooter .highFix, .eFooter .highFix span {		';
  html = html + '		text-decoration: none;	';
  html = html + '		cursor: pointer;	';
  html = html + '	}		';
  html = html + '	/* Highlight Area */		';
  html = html + '	.highlight {		';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	h1 {		';
  html = html + '		font-size: 24px;	';
  html = html + '		line-height: 36px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.highlight p {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.profilePicture, .highlightIcon {		';
  html = html + '		text-align: center;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '		width: 64px;	';
  html = html + '		height: 64px;	';
  html = html + '	}		';
  html = html + '	.profilePicture td {		';
  html = html + '		padding-top: 10px;	';
  html = html + '		padding-bottom: 6px;	';
  html = html + '	}		';
  html = html + '	.highlightIcon td {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.profileName {		';
  html = html + '		font-size: 16px;	';
  html = html + '		line-height: 24px;	';
  html = html + '	}		';
  html = html + '	.profileName span {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.bannerLink a {		';
  html = html + '		display: block;	';
  html = html + '		height: 194px;	';
  html = html + '		line-height: 0;	';
  html = html + '		text-align: center;	';
  html = html + '		font-size: 16px;	';
  html = html + '	}		';
  html = html + '	.bannerLink img {		';
  html = html + '		display: block;	';
  html = html + '		vertical-align: top;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	/* Content Body */		';
  html = html + '	.eBody p, .eBody li {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	.eBody p a span {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.quoteTable td {		';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-top: 10px;	';
  html = html + '	}		';
  html = html + '	.aSignature {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 18px;	';
  html = html + '	}		';
  html = html + '	.eBody .aSignature a, .eBody .aSignature a span {		';
  html = html + '		font-weight: normal;	';
  html = html + '	}		';
  html = html + '	/* Content Articles */		';
  html = html + '	h2 {		';
  html = html + '		font-size: 18px;	';
  html = html + '		line-height: 26px;	';
  html = html + '		margin-bottom: 5px;	';
  html = html + '		font-weight: normal;	';
  html = html + '	}		';
  html = html + '	h2 span {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.messageSection .width116, .messageSection .messageArrow, .messageSection .width380 {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.messageOptions.alignRight {		';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: 0;	';
  html = html + '	}		';
  html = html + '	.bubble table, .bubble table td {		';
  html = html + '		width: 16px;	';
  html = html + '		height: 26px;	';
  html = html + '	}		';
  html = html + '	.bubbleContent {		';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-left: 12px;	';
  html = html + '		padding-right: 12px;	';
  html = html + '	}		';
  html = html + '	.senderProfile .profilePicture td {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 14px;	';
  html = html + '	}		';
  html = html + '	.senderProfile p, .entryBox .senderProfile p {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 19px;	';
  html = html + '	}		';
  html = html + '	.senderProfile a {		';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	/* Invoice #1 */		';
  html = html + '	.invoiceTable td {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 19px;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.serviceName {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable .downloadInv {		';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	.downloadInv a {		';
  html = html + '		width: 100%;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto	';
  html = html + '	}		';
  html = html + '	.invoiceTable .amount {		';
  html = html + '		font-weight: bold;	';
  html = html + '		font-size: 16px;	';
  html = html + '		line-height: 24px;	';
  html = html + '	}		';
  html = html + '	/* Invoice #2 */		';
  html = html + '	.invoiceHead, .invoiceHead td, .invoiceHead p {		';
  html = html + '		text-align: left;	';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.invoiceHead p, .invoiceList td {		';
  html = html + '		line-height: 19px;	';
  html = html + '	}		';
  html = html + '	.invoiceHead .amount {		';
  html = html + '		font-weight: bold;	';
  html = html + '		font-size: 16px;	';
  html = html + '	}		';
  html = html + '	h4 {		';
  html = html + '		font-size: 14px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	h4 span {		';
  html = html + '		font-size: 12px;	';
  html = html + '		font-weight: normal;	';
  html = html + '	}		';
  html = html + '	.ihTitle strong, .ihTitle span {		';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable2 th, .invoiceTable2 td {		';
  html = html + '		padding-top: 14px;	';
  html = html + '		padding-bottom: 14px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 19px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable2 th {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 6px;	';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 16px;	';
  html = html + '		font-weight: bold;	';
  html = html + '		text-transform: uppercase;	';
  html = html + '	}		';
  html = html + '	.servDetails {		';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable2 .subTotal {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.eTotal .amount {		';
  html = html + '		font-size: 16px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	/* Invoice #3 */		';
  html = html + '	.invoiceTable3 th, .invoiceTable3 td {		';
  html = html + '		padding-right: 16px;	';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 th {		';
  html = html + '		padding-top: 6px;	';
  html = html + '		border-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 td {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodTitle {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		border-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodDesc {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 18px;	';
  html = html + '		padding-right: 0;	';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '		padding-right: 8px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .subTotal, .invoiceTable3 .eTotal {		';
  html = html + '		padding-top: 16px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .eQuantity {		';
  html = html + '		width: 40px;	';
  html = html + '		padding-right: 0;	';
  html = html + '		text-align: center;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .servDetails {		';
  html = html + '		font-size: 11px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodImg {		';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 10px;	';
  html = html + '	}		';
  html = html + '	/* Price Tables */		';
  html = html + '	.priceTable .priceColumn {		';
  html = html + '		width: 72px;	';
  html = html + '		padding-right: 1px;	';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.priceColumn table {		';
  html = html + '		width: 100%;	';
  html = html + '	}		';
  html = html + '	.priceColumn td, .tableOption td {		';
  html = html + '		font-size: 14px;	';
  html = html + '		text-align: center;	';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-bottom: 12px;	';
  html = html + '		height: 24px;	';
  html = html + '	}		';
  html = html + '	.tableOption td {		';
  html = html + '		line-height: 18px !important;	';
  html = html + '	}		';
  html = html + '	.priceColumn .mobileHide {		';
  html = html + '		line-height: 18px !important;	';
  html = html + '	}		';
  html = html + '	.priceColumn .tableBtn {		';
  html = html + '		border-bottom: 0;	';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.priceColumn .tableBtn a {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.priceColumn th {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 17px;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		font-weight: normal;	';
  html = html + '		text-align: center;	';
  html = html + '		width: 72px;	';
  html = html + '		height: 60px;	';
  html = html + '		padding-top: 6px;	';
  html = html + '		padding-bottom: 6px;	';
  html = html + '	}		';
  html = html + '	.priceColumn.recommend th {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.priceColumn th strong {		';
  html = html + '		font-size: 18px;	';
  html = html + '		line-height: 26px;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		height: 26px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.tableOption {		';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '		padding-right: 1px;	';
  html = html + '	}		';
  html = html + '	.tableOption td {		';
  html = html + '		text-align: right;	';
  html = html + '	}		';
  html = html + '	.tableOption th {		';
  html = html + '		display: block;	';
  html = html + '		height: 72px;	';
  html = html + '		font-size: 0;	';
  html = html + '		line-height: 0;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	/* Stats */		';
  html = html + '	.twcoList td, .invoiceTable2.twcoList td {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-top: 10px;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.twcoList th, .eBody .twcoList th {		';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	.visitStats {		';
  html = html + '		vertical-align: middle;	';
  html = html + '	}		';
  html = html + '	.visitStats table {		';
  html = html + '		margin-top: auto;	';
  html = html + '		margin-bottom: auto;	';
  html = html + '	}		';
  html = html + '	.visitStats td {		';
  html = html + '		padding-top: 5px;	';
  html = html + '		padding-bottom: 5px;	';
  html = html + '		padding-left: 10px;	';
  html = html + '		padding-right: 10px;	';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	.visitStats .visitPro {		';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		width: 46px;	';
  html = html + '		text-align: center;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	/* Text Colors */		';
  html = html + '	a, a span, .tableBtn a span, .priceColumn td a span {		';
  html = html + '		color: #ff9826;	';
  html = html + '	}		';
  html = html + '	.entryBox p, .eBody, .invoiceTable td, .invoiceTable p, .invoiceTable2 th, .invoiceTable2 td, .invoiceTable2 p, .priceTable td, .priceTable th, .priceTable p, h4, .subTotal .amount, .invoiceHead .amount, .twcoList strong, .eBody .twcoList strong, .priceColumn td span {		';
  html = html + '		color: #242424;	';
  html = html + '	}		';
  html = html + '	.mainBtn a, .mainBtn a span, .tag .tagName, .secondaryBtn a, .secondaryBtn a span, .lightBtn a, .lightBtn span, .defaultBtn a, .defaultBtn a span, .priceColumn.recommend th, .priceColumn.recommend th strong, .priceColumn.recommend th span, .visitStats .visitPro {		';
  html = html + '		color: #ffffff;	';
  html = html + '	}		';
  html = html + '	.eFooter, .eFooter .highFix, .eFooter .highFix span {		';
  html = html + '		color: #b2b2b2;	';
  html = html + '	}		';
  html = html + '	.eFooter a, .eFooter a span {		';
  html = html + '		color: #808080;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnMain a, .optionsButton .btnMain span {		';
  html = html + '		color: #ffffff;	';
  html = html + '	}		';
  html = html + '	.highlight p, .psMsg, .senderProfile p, .entryBox .senderProfile p, .invoiceHead, .invoiceHead td, .invoiceHead p, .invoiceTable2 .subTotal, .servDetails, .aSignature, .eBody .aSignature a, .eBody .aSignature a span, h4 span, .invoiceTable2 th, .twcoList td, .invoiceTable2.twcoList td, .priceTable .tableBtn, .priceColumn span, .invoiceTable3 .prodDesc, .label, .subtleBtn td, .subtleBtn td a, .subtleBtn td a span {		';
  html = html + '		color: #898989;	';
  html = html + '	}		';
  html = html + '	h1, h1 span, h2, h2 span, .invoiceHead .ihBlack, span.serviceName {		';
  html = html + '		color: #242424;	';
  html = html + '	}		';
  html = html + '	.priceTable th strong, .amount, .priceColumn.recommend, .priceTable .spBtn, .priceTable .spBtn span, .profileName, .profileName span, .invoiceTable .amount, .bannerLink a {		';
  html = html + '		color: #666666;	';
  html = html + '	}		';
  html = html + '	.quoteTable td {		';
  html = html + '		color: #898989;	';
  html = html + '	}		';
  html = html + '	/* Background Colors */		';
  html = html + '	.defaultBtn td {		';
  html = html + '		background-color: #7d7d7d;	';
  html = html + '	}		';
  html = html + '	.priceColumn.recommend th {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.topCorners td, .eHeader, .bottomCorners, .ReadMsgBody, .ExternalClass, .eBody, .invoiceTable2, .invoiceTable2 td, .invoiceTable2 th, .priceColumn.recommend .tableBtn {		';
  html = html + '		background-color: #ffffff;	';
  html = html + '	}		';
  html = html + '	.priceColumn .tableBtn, .priceColumnRec .tableBtn {		';
  html = html + '		border-bottom: 0 soldi #ffffff; /* same as above */	';
  html = html + '	}		';
  html = html + '	body, #emailBody, .emailBodyCell {		';
  html = html + '		background-color: #f2f2f2;	';
  html = html + '	}		';
  html = html + '	.optionsButton td {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.highlight, .bubble td, .bubble table td, .invoiceTable2 .subTotal, .priceColumn th, .priceColumn.recommend td {		';
  html = html + '		background-color: #fafafa;	';
  html = html + '	}		';
  html = html + '	.visitStats .visitPro {		';
  html = html + '		background-color: #242424;	';
  html = html + '	}		';
  html = html + '	.mainBtn td {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor1 {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.tag td {		';
  html = html + '		background-color: #cbcbcb;	';
  html = html + '	}		';
  html = html + '	.lightBtn td {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.secondaryBtn td {		';
  html = html + '		background-color: #bebebe;	';
  html = html + '	}		';
  html = html + '	.bubble2 td {		';
  html = html + '		background-color: #fafafa;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor2 {		';
  html = html + '		background-color: #7d7d7d;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor3 {		';
  html = html + '		background-color: #cbcbcb;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor4 {		';
  html = html + '		background-color: #ef954d;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor5 {		';
  html = html + '		background-color: #a478e5;	';
  html = html + '	}		';
  html = html + '	/* Borders */		';
  html = html + '	.eHeader, .highlight, .subTotal, .bottomLine, .invoiceTable2 th, .eTotal {		';
  html = html + '		border-bottom: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodTitle {		';
  html = html + '		border-top: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.quoteTable td {		';
  html = html + '		border-left: 6px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.tableOption td, .tableOption th, .priceColumn td, .priceColumn th {		';
  html = html + '		border-bottom: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.priceColumn.recommend th {		';
  html = html + '		border-bottom: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	 @media only screen {		';
  html = html + '	td[class=btnMain] {		';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnMain] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 10px 22px !important;	';
  html = html + '		line-height: 26px !important;	';
  html = html + '	}		';
  html = html + '	table[class=tag] td {		';
  html = html + '		border-collapse: separate !important;	';
  html = html + '	}		';
  html = html + '	td[class=tagName], td[class~=invoiceHead] td[class=tagName] {		';
  html = html + '		font-size: 11px !important;	';
  html = html + '		line-height: 14px !important;	';
  html = html + '	}		';
  html = html + '	table[class=optionsButton] {		';
  html = html + '		width: auto !important;	';
  html = html + '	}		';
  html = html + '	table[class=optionsButton] td[class=btnMain] a {		';
  html = html + '		padding: 7px 4px 7px 6px !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnIcon] {		';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnIcon] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 6px 2px 6px 7px !important;	';
  html = html + '	}		';
  html = html + '	table[class=subtleBtn] td {		';
  html = html + '		padding: 9px 0 25px !important;	';
  html = html + '	}		';
  html = html + '	table[class=subtleBtn] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 7px 8px !important;	';
  html = html + '	}		';
  html = html + '	}		';
  html = html + '	 @media only screen and (max-width: 600px) {		';
  html = html + '	td[class=emailBodyCell] {		';
  html = html + '		padding-left: 0 !important;	';
  html = html + '		padding-right: 0 !important;	';
  html = html + '	}		';
  html = html + '	}		';
  html = html + '	 @media only screen and (max-width: 560px) {		';
  html = html + '	td[class=emailBodyCell] {		';
  html = html + '		padding: 8px !important;	';
  html = html + '	}		';
  html = html + '	table[id=emailBody], td[class=emailBodyCell], table[class=eBox], td[class=highlight], td[class~=highlight], td[class=eBody], td[class~=eBody], div[class=bannerLink] a, div[class=bannerLink] img {		';
  html = html + '		display: block !important;	';
  html = html + '		width: auto !important;	';
  html = html + '	}		';
  html = html + '	td[class=highlight], td[class~=highlight], td[class=eBody], td[class~=eBody] {		';
  html = html + '		overflow: hidden !important;	';
  html = html + '	}		';
  html = html + '	td[class=width40], td[class~=width40], td[class=width54], td[class~=width54], td[class=width64], td[class~=width64], td[class=width80], td[class~=width80], td[class=width84], td[class~=width84], td[class=width116], td[class~=width116], td[class=width246], td[class~=width246], td[class=width248], td[class~=width248], td[class=width132], td[class~=width132], td[class=width184], td[class~=width184], td[class=width312], td[class~=width312], td[class=width380], td[class~=width380], td[class=width412], td[class~=width412], td[class=width448], td[class~=width448], td[class=width458], td[class~=width458], td[class=priceColumn], td[class~=priceColumn], td[class~=subTotal], table[class=invoiceList] td, td[class=width184], td[class~=width184], table[class=entryBox] td[class=alignLeft], table[class=invoiceTable] td[class~=alignLeft], table[class=invoiceTable] td[class=alignRight], td[class~=invoiceHead] table, td[class~=invoiceHead] td[class=alignLeft], table[class~=messageSection], td[class~=senderProfile], td[class~=messageArrow], td[class~=prodDesc], td[class~=eQuantity], td[class~=highlight] td[class=alignLeft], table[class=statsData] td[class~=width248] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		display: block !important;	';
  html = html + '		padding-right: 0 !important;	';
  html = html + '	}		';
  html = html + '	div[class=bannerLink] a {		';
  html = html + '		height: auto !important;	';
  html = html + '	}		';
  html = html + '	div[class=bannerLink] a, div[class=bannerLink] img {		';
  html = html + '		width: 100% !important;	';
  html = html + '	}		';
  html = html + '	td[class=highlight] h1, td[class~=highlight] h1 {		';
  html = html + '		font-size: 28px !important;	';
  html = html + '		line-height: 36px !important;	';
  html = html + '	}		';
  html = html + '	td[class=eBody] h2, td[class~=eBody] h2, td[class=priceColumn] th, td[class~=priceColumn] th strong {		';
  html = html + '		font-size: 22px !important;	';
  html = html + '		line-height: 30px !important;	';
  html = html + '		margin-bottom: 8px !important;	';
  html = html + '	}		';
  html = html + '	strong[class=amount], td[class~=eTotal] span[class=amount] {		';
  html = html + '		font-size: 20px !important;	';
  html = html + '		line-height: 24px !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnMain] a {		';
  html = html + '		font-size: 20px;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] th, td[class~=priceColumn] th, td[class~=prodTitle] h4, td[class~=invoiceHead] p[class=amount] {		';
  html = html + '		font-size: 18px !important;	';
  html = html + '		line-height: 26px !important;	';
  html = html + '	}		';
  html = html + '	td[class=eBody] p, td[class~=eBody] p, td[class=highlight] p, td[class~=highlight] p, table[class=invoiceTable2] td, table[class~=invoiceTable2] td, span[class=serviceName], td[class=priceColumn] td, td[class~=priceColumn] td, td[class~=highlight] h4, table[class=subtleBtn] a {		';
  html = html + '		font-size: 16px !important;	';
  html = html + '		line-height: 24px !important;	';
  html = html + '	}		';
  html = html + '	td[class=eBody] p, td[class~=eBody] p, td[class=highlight] p, td[class~=highlight] p {		';
  html = html + '		margin-bottom: 18px;	';
  html = html + '	}		';
  html = html + '	td[class~=invoiceHead] td, td[class~=invoiceHead] p, span[class=aSignature], td[class~=highlight] h4 span, span[class=servDetails] {		';
  html = html + '		font-size: 14px !important;	';
  html = html + '		line-height: 21px !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable] td {		';
  html = html + '		font-size: 13px !important;	';
  html = html + '		line-height: 21px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] td {		';
  html = html + '		line-height: 30px !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnIcon] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 12px 12px !important;	';
  html = html + '	}		';
  html = html + '	td[class=highlight], td[class~=highlight], td[class=eBody], td[class~=eBody] {		';
  html = html + '		padding-top: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=entryBox] td[class=width132], table[class=entryBox] td[class~=width132] {		';
  html = html + '		text-align: center !important;	';
  html = html + '	}		';
  html = html + '	table[class~=messageSection], table[class=entryBox] td[class=width132] a img, table[class=entryBox] td[class~=width132] a img {		';
  html = html + '		margin-top: 16px !important;	';
  html = html + '		margin-bottom: 16px !important;	';
  html = html + '	}		';
  html = html + '	td[class~=highlight] td[class~=width116], td[class=highlight] table[class=invoiceTable] td[class~=downloadInv] {		';
  html = html + '		text-align: center !important;	';
  html = html + '	}		';
  html = html + '	td[class~=highlight] table[class=invoiceList] td[class~=width116], table[class=invoiceTable] td[class~=width116] {		';
  html = html + '		text-align: left !important;	';
  html = html + '	}		';
  html = html + '	td[class~=highlight] td[class~=width116] img {		';
  html = html + '		margin-top: 16px !important;	';
  html = html + '		margin-bottom: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=profilePicture] td {		';
  html = html + '		padding-top: 8px !important;	';
  html = html + '		padding-bottom: 4px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=messageSection] td[class=width380] {		';
  html = html + '		padding-bottom: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] {		';
  html = html + '		padding-bottom: 0 !important;	';
  html = html + '		text-align: center !important;	';
  html = html + '		vertical-align: top !important;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '		height: 26px !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] table {		';
  html = html + '		transform: rotate(90deg) !important;	';
  html = html + '		-ms-transform: rotate(90deg) !important;	';
  html = html + '		-webkit-transform: rotate(90deg) !important;	';
  html = html + '		margin-right: auto !important;	';
  html = html + '		margin-left: auto !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] table[class=bubble] {		';
  html = html + '		margin-top: 5px !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] table[class=bubble2] {		';
  html = html + '		margin-top: -5px !important;	';
  html = html + '	}		';
  html = html + '	table[class=messageOptions], table[class~=messageOptions] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '	}		';
  html = html + '	table[class=messageOptions] td[class=moBtn], table[class~=messageOptions] td[class~=moBtn], table[class=statsData] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		margin: 0 !important;	';
  html = html + '		float: left !important;	';
  html = html + '		margin-top: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable2], table[class~=invoiceTable2] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		margin: 0 !important;	';
  html = html + '		float: left !important;	';
  html = html + '	}		';
  html = html + '	table[class=mainBtn], table[class~=mainBtn], table[class=secondaryBtn], table[class~=secondaryBtn], table[class=defaultBtn], table[class~=defaultBtn], table[class=lightBtn], table[class~=lightBtn], table[class=subtleBtn] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		margin: 0 !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable2] td, table[class~=invoiceTable2] td {		';
  html = html + '		-webkit-box-sizing: border-box !important;	';
  html = html + '		-moz-box-sizing: border-box !important;	';
  html = html + '		box-sizing: border-box !important;	';
  html = html + '		text-align: left !important;	';
  html = html + '		padding-right: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable2] td[class=width312] {		';
  html = html + '		border-top: 1px solid #ebebeb !important;	';
  html = html + '		padding-top: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td[class~=prodImg] {		';
  html = html + '		height: 1px !important;	';
  html = html + '		position: relative !important;	';
  html = html + '		overflow: visible !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class~=prodImg] img {		';
  html = html + '		position: absolute !important;	';
  html = html + '		right: 16px !important;	';
  html = html + '		top: 0 !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td {		';
  html = html + '		padding-left: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td[class~=prodDesc] {		';
  html = html + '		padding-right: 112px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td[class~=prodDesc] {		';
  html = html + '		font-size: 14px !important;	';
  html = html + '		line-height: 21px !important;	';
  html = html + '	}		';
  html = html + '	 td[class=width248 pdBt16 pdRg16 alignCenter], td[class=highlight pdBt16 alignLeft] td[class=width116 pdRg16], td[class=highlight pdBt16 alignLeft] td[class=alignLeft] {		';
  html = html + '	 padding-right: 0 !important;		';
  html = html + '	 text-align: center !important;		';
  html = html + '	}		';
  html = html + '	 td[class=width248 pdBt16 pdRg16 alignCenter] img, td[class=highlight pdBt16 alignLeft] td[class=width116 pdRg16] img {		';
  html = html + '	 display: inline-block !important;		';
  html = html + '	}		';
  html = html + '	td[class~=senderProfile], table[class=bubble] td[class=width380] {		';
  html = html + '		padding-bottom: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class~=senderProfile] p {		';
  html = html + '		margin-bottom: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn], td[class~=priceColumn] {		';
  html = html + '		padding-bottom: 32px !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] th, td[class~=priceColumn] th {		';
  html = html + '		padding: 16px 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] td, td[class~=priceColumn] td {		';
  html = html + '		border: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] td[class=tableBtn] {		';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] img, td[class~=priceColumn] img {		';
  html = html + '		vertical-align: top !important;	';
  html = html + '		margin: 2px 6px 0 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] a, td[class~=priceColumn] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 10px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] th {		';
  html = html + '		padding-top: 16px !important;	';
  html = html + '		padding-right: 0 !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] td[class=width116], table[class~=twcoList] td[class~=width116] {		';
  html = html + '		padding-right: 0 !important;	';
  html = html + '		display: table-cell !important;	';
  html = html + '		width: 60% !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] td[class~=pdLf16] {		';
  html = html + '		width: 40% !important;	';
  html = html + '	}		';
  html = html + '	span[class=desktopHide] {		';
  html = html + '		display: inline-block !important;	';
  html = html + '		font-size: inherit !important;	';
  html = html + '		max-height: none !important;	';
  html = html + '		line-height: inherit !important;	';
  html = html + '		padding-right: 6px !important;	';
  html = html + '		overflow: visible !important;	';
  html = html + '		width: auto !important;	';
  html = html + '	}		';
  html = html + '	td[class=mobileHide], td[class~=mobileHide], td[class=tableOption], table[class=invoiceTable2] th, table[class~=invoiceTable3] th {		';
  html = html + '		display: none !important;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		width: 0 !important;	';
  html = html + '		max-height: 0 !important;	';
  html = html + '		line-height: 0 !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '	}';
  html = html + '	}';
  html = html + '	</style>';
  html = html + '	<style type="text/css">';
  html = html + '	</style>';
  html = html + '	</head>';
  html = html + '	<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: 100%;width: 100%;min-height: 1000px;background-color: #f2f2f2;">		';
  html = html + '	<div class="emailSummary" style="mso-hide: all;display: none !important;font-size: 0 !important;max-height: 0 !important;line-height: 0 !important;padding: 0 !important;overflow: hidden !important;float: none !important;width: 0 !important;height: 0 !important;">You just registered at mightymerce. Please verify your eMail address by clicking the link.</div>		';
  html = html + '	<table id="emailBody" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;height: 100%;width: 100%;min-height: 1000px;background-color: #f2f2f2;">		';
  html = html + '	  <tr>		';
  html = html + '	    <td align="center" valign="top" class="emailBodyCell" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 32px;padding-bottom: 32px;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;height: 100%;width: 100%;min-height: 1000px;background-color: #f2f2f2;"><table width="544" border="0" cellpadding="0" cellspacing="0" class="eBox" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;width: 544px;">		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="eHeader" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 16px;padding-bottom: 16px;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;width: 512px;background-color: #ffffff;border-bottom: 1px solid #ebebeb;"><table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td class="eHeaderLogo" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;height: 48px;text-align: left;font-size: 0 !important;font-weight: bold;"><a href="#" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ff9826;height: 48px;text-align: left;font-size: 18px;font-weight: bold;line-height: 0;"><img class="imageFix" src="http://ec2-54-85-218-20.compute-1.amazonaws.com/modules/core/client/img/brand/mm_Logo.png" width="200" height="48" alt="mightymerce" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: auto;width: auto;line-height: 100%;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;border: none;display: block;vertical-align: top;"></a></td>		';
  html = html + '	                <!-- end .eHeaderLogo-->		';
  //html = html + '	                <td class="eHeaderOptions" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;height: 48px;text-align: right;vertical-align: top;font-size: 0 !important;"><table border="0" cellpadding="0" cellspacing="0" class="optionsButton" align="right" style="margin-top: 0;margin-left: auto;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;width: 152px;text-align: left;">		';
  //html = html + '	                    <tr>		';
  //html = html + '	                      <td class="btnIcon" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 5px;padding-bottom: 5px;padding-left: 6px;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;background-color: #ffffff;width: 16px;height: 16px;text-align: center;vertical-align: middle;"><a href="#" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ffffff;margin-top: auto;margin-left: auto;margin-right: auto;margin-bottom: auto;"><img src="" width="16" height="16" alt="Options" style="margin-top: auto;margin-left: auto;margin-right: auto;margin-bottom: auto;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: 16px;width: 16px;line-height: 100%;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;border: none;"></a></td>		';
  //html = html + '	                      <td class="btnMain mobileHide" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 5px;padding-bottom: 5px;padding-left: 6px;padding-right: 6px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;background-color: #ffffff;height: 16px;font-size: 18px;line-height: 16px;mso-line-height-rule: exactly;text-align: left;vertical-align: middle;"><a href="#" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ffffff;font-size: 12px;"><span style="text-decoration: none;color: #ffffff;font-size: 12px;"></span></a></td>		';
  //html = html + '	                    </tr>		';
  //html = html + '	                  </table></td>		';
  html = html + '	                <!-- end .eHeaderOptions--> 		';
  html = html + '	              </tr>		';
  html = html + '	            </table></td>		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="highlight pdTp32" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 32px;padding-bottom: 0;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;width: 512px;text-align: center;background-color: #fafafa;border-bottom: 1px solid #ebebeb;"><h1 style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 5px;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;font-size: 24px;line-height: 36px;font-weight: bold;color: #242424;"><span style="color: #242424;">Welcome to mightymerce</span></h1>		';
  html = html + '	            <table border="0" align="center" cellpadding="0" cellspacing="0" class="profilePicture" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;text-align: center;width: 64px;height: 64px;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 10px;padding-bottom: 6px;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;"><img src="http://ec2-54-85-218-20.compute-1.amazonaws.com/modules/core/client/img/user_icon.png" width="64" height="64" alt="Your Profile Picture" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: auto;width: auto;line-height: 100%;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></td>		';
  html = html + '	              </tr>		';
  html = html + '	            </table>		';
  html = html + '	            <p class="profileName" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 24px;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;font-size: 14px;line-height: 22px;color: #898989;"><span style="font-weight: bold;color: #666666;">' + inputData.usereMail + '</span><br>		';
  html = html + '	              ' + inputData.userDate + '</p></td>		';
  html = html + '	          <!-- end .highlight--> 		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="eBody alignCenter pdTp32" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 32px;padding-bottom: 0;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;text-align: center;width: 512px;color: #242424;background-color: #ffffff;"><p style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 24px;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;text-align: center;font-size: 14px;line-height: 22px;">You are ready to setup your new mightymerce account.<br>		';
  html = html + '	              Click the button below  to...</p>		';
  html = html + '	            <table border="0" cellpadding="0" cellspacing="0" class="mainBtn" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td align="center" valign="middle" class="btnMain" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 12px;padding-bottom: 12px;padding-left: 22px;padding-right: 22px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;background-color: #f6ba78;height: 20px;font-size: 18px;line-height: 20px;mso-line-height-rule: exactly;text-align: center;vertical-align: middle;"><a href="' + link + '" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ffffff;font-weight: bold;"><span style="text-decoration: none;color: #ffffff;">Activate your Account</span></a></td>		';
  html = html + '	              </tr>		';
  html = html + '	            </table>		';
  html = html + '	            <table align="center" border="0" cellpadding="0" cellspacing="0" class="subtleBtn" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 16px;padding-bottom: 32px;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;font-size: 14px;color: #898989;"><a href="' + linkcancel + '" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #898989;"><span style="text-decoration: none;color: #898989;">Cancel subscription request</span></a></td>		';
  html = html + '	              </tr>		';
  html = html + '	            </table></td>		';
  html = html + '	          <!-- end .eBody--> 		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="bottomCorners" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;width: 544px;height: 16px;background-color: #ffffff;">&nbsp;</td>		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="eFooter" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 14px;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;text-align: center;font-size: 12px;line-height: 21px;width: 544px;color: #b2b2b2;">© 2016 mightymerce. All Rights Reserved. <br>		';
  html = html + '	            <a href="#" class="highFix" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #b2b2b2;cursor: pointer;"><span style="text-decoration: none;color: #b2b2b2;cursor: pointer;">Frankfurt • Germany</span></a></td>		';
  html = html + '	        </tr>		';
  html = html + '	      </table>		';
  html = html + '	      		';
  html = html + '	      <!-- end .eBox --></td>		';
  html = html + '	    <!-- end .emailBodyCell --> 		';
  html = html + '	  </tr>		';
  html = html + '	</table>		';
  html = html + '	<!-- end #emailBody -->		';
  html = html + '	</body>		';
  html = html + '	</html>		';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Mightymermerce | activation <noreply@mightymerce.com>', // sender address
    to: inputData.usereMail, // list of receivers
    subject: 'Your activation email for mightymerce. Start converting your followers into customers', // Subject line
    text: '', // plaintext body
    html: html
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    var links = {
      activateURL: rand,
      cancelURL: linkcancel
    };
    console.log('users.authentication.server.controller - sendactivateemail - sent mail success: ' +link);
    return res.json(links);
  });
};


/**
 * Send welcome email
 */
exports.sendwelcomeemail = function (req, res, next) {

  var link;

  link = 'http://'+req.get('host');

  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: true, // use SSL
    auth: {
      user: 'wagner@mightymerce.com',
      pass: 'pufyeytpdejudtfk'
    }
  });

  var inputData = req.body;

  console.log('users.authentication.server.controller - sendactivateemail - start');

  var html = html + '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
  html = html + '	<html xmlns="http://www.w3.org/1999/xhtml">';
  html = html + '	<head>';
  html = html + '	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
  html = html + '	<meta name="viewport" content="width=device-width">';
  html = html + '	<meta name="format-detection" content="address=no;email=no;telephone=no">';
  html = html + '	<title>Welcome to mightymerce</title>';
  html = html + '	<style type="text/css">';
  html = html + '	/* Modified:30/10/2014 */		';
  html = html + '	/* Global Reset */		';
  html = html + '			';
  html = html + '	body {		';
  html = html + '		-webkit-text-size-adjust: 100%;	';
  html = html + '		-ms-text-size-adjust: 100%;	';
  html = html + '	}		';
  html = html + '	body, p, h1, h2, h3, h4, h5, h6, img, table, td, #emailBody {		';
  html = html + '		margin-top: 0;	';
  html = html + '		margin-left: 0;	';
  html = html + '		margin-right: 0;	';
  html = html + '		margin-bottom: 0;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	a, #outlook a {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		display: inline-block;	';
  html = html + '	}		';
  html = html + '	a, a span {		';
  html = html + '		text-decoration: none;	';
  html = html + '	}		';
  html = html + '	a img {		';
  html = html + '		border: none;	';
  html = html + '	}		';
  html = html + '	img {		';
  html = html + '		height: auto;	';
  html = html + '		width: auto;	';
  html = html + '		line-height: 100%;	';
  html = html + '		outline: none;	';
  html = html + '		text-decoration: none;	';
  html = html + '		-ms-interpolation-mode: bicubic;	';
  html = html + '	}		';
  html = html + '	.imageFix {		';
  html = html + '		display: block;	';
  html = html + '	}		';
  html = html + '	table {		';
  html = html + '		mso-table-lspace: 0pt;	';
  html = html + '		mso-table-rspace: 0pt;	';
  html = html + '	}		';
  html = html + '	table, td {		';
  html = html + '		border-collapse: collapse;	';
  html = html + '		border-spacing: 0;	';
  html = html + '	}		';
  html = html + '	.ExternalClass {		';
  html = html + '		display: block !important;	';
  html = html + '		width: 100%;	';
  html = html + '	}		';
  html = html + '	.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {		';
  html = html + '		line-height: 100%;	';
  html = html + '	}		';
  html = html + '	.ReadMsgBody, .ExternalClass {		';
  html = html + '		width: 100%;	';
  html = html + '	}		';
  html = html + '	/* Default Typography */		';
  html = html + '	td, th, p, a, li, h1, h2, h3, h4, h5, h6 {		';
  html = html + '		-webkit-text-size-adjust : none;	';
  html = html + '		font-family: Arial, Helvetica, sans-serif;	';
  html = html + '	}		';
  html = html + '	h1, h2, h3, h4, h5, h6 {		';
  html = html + '		margin-bottom: 5px;	/* Outlook.com default */';
  html = html + '	}		';
  html = html + '	p, p.MsoNormal {		';
  html = html + '		margin-bottom: 24px; /* Outlook.com default */	';
  html = html + '	}		';
  html = html + '	/* Alignment */		';
  html = html + '	.alignCenter, .eBody .alignCenter, .alignCenter p, .eBody.alignCenter p, .eBody .alignCenter p {		';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	table.alignCenter, .alignCenter table, .alignCenter img {		';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	.alignLeft, .eBody .alignLeft, .eBody.alignLeft p, .eBody .alignLeft p, .highlight.alignLeft, .invoiceTable2 .alignLeft {		';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	table.alignLeft, .alignLeft table, .alignLeft img {		';
  html = html + '		margin-left: 0;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	.alignRight, .eBody .alignRight, .eBody.alignRight p, .eBody .alignRight p, .highlight.alignRight, .width132.alignRight, .invoiceTable2 .alignRight {		';
  html = html + '		text-align: right;	';
  html = html + '	}		';
  html = html + '	table.alignRight, .alignRight table, .alignRight a {		';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: 0;	';
  html = html + '	}		';
  html = html + '	/* Visual Help */		';
  html = html + '	.desktopHide {		';
  html = html + '		display: none;	';
  html = html + '		font-size: 0;	';
  html = html + '		max-height: 0;	';
  html = html + '		width: 0;	';
  html = html + '		line-height: 0;	';
  html = html + '		overflow: hidden;	';
  html = html + '		mso-hide: all;	';
  html = html + '	}		';
  html = html + '	/* Email Body */		';
  html = html + '	body, #emailBody, .emailBodyCell {		';
  html = html + '		height: 100%;	';
  html = html + '		width: 100%;	';
  html = html + '		min-height: 1000px;	';
  html = html + '	}		';
  html = html + '	.emailBodyCell {		';
  html = html + '		padding-top: 32px;	';
  html = html + '		padding-bottom: 32px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '	}		';
  html = html + '	/* Summary */		';
  html = html + '	.emailSummary {		';
  html = html + '		display: none !important;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		max-height: 0 !important;	';
  html = html + '		line-height: 0 !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		mso-hide: all;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '		float: none !important;	';
  html = html + '		width: 0 !important;	';
  html = html + '		height: 0 !important;	';
  html = html + '	}		';
  html = html + '	/* Spacing */		';
  html = html + '	.emptyCell, .eBody .emptyCell, .highlight .emptyCell, .eBody .space6, .eBody .space10, .invoiceHead .space6, .eBody .space16, .invoiceHead .space16, .space32, .eBody .space32, .invoiceHead .space32, .emptyCell {		';
  html = html + '		line-height: 0 !important;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	.eBody .space6, .invoiceHead .space6 {		';
  html = html + '		height: 6px;	';
  html = html + '		width: 6px;	';
  html = html + '	}		';
  html = html + '	.eBody .space10, .invoiceHead .space10 {		';
  html = html + '		height: 10px;	';
  html = html + '		width: 10px;	';
  html = html + '	}		';
  html = html + '	.eBody .space16, .invoiceHead .space16 {		';
  html = html + '		height: 16px;	';
  html = html + '		width: 16px;	';
  html = html + '	}		';
  html = html + '	.space32, .eBody .space32, .invoiceHead .space32 {		';
  html = html + '		height: 32px;	';
  html = html + '		width: 16px;	';
  html = html + '	}		';
  html = html + '	.pdTp0, .eBox .pdTp0, .highlight.pdTp0, .eBody.pdTp0, .invoiceTable2 .pdTp0, .invoiceTable2.twcoList .pdTp0 {		';
  html = html + '		padding-top: 0px;	';
  html = html + '	}		';
  html = html + '	.pdTp32, .eBox .pdTp32, .highlight.pdTp32, .eBody.pdTp32, .invoiceTable2 .pdTp32, .invoiceTable2.twcoList .pdTp32 {		';
  html = html + '		padding-top: 32px;	';
  html = html + '	}		';
  html = html + '	.pdBt16, .eBox .pdBt16, .highlight.pdBt16, .eBody.pdBt16, .eBox .pdBt16, .invoiceTable2 .pdBt16, .invoiceTable2.twcoList .pdBt16 {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.pdRg16, .eBox .pdRg16, .highlight.pdRg16, .eBody.pdRg16, .eBox .pdRg16, .invoiceTable2 .pdRg16, .invoiceTable2.twcoList .pdRg16 {		';
  html = html + '		padding-right: 16px;	';
  html = html + '	}		';
  html = html + '	.pdLf16, .eBox .pdLf16, .highlight.pdLf16, .eBody.pdLf16, .invoiceTable2 .pdLf16, .invoiceTable2.twcoList .pdLf16 {		';
  html = html + '		padding-left: 16px;	';
  html = html + '	}		';
  html = html + '	.pdLf0, .eBox .pdLf0, .highlight.pdLf0, .eBody.pdLf0, .invoiceTable2 .pdLf0, .invoiceTable2.twcoList .pdLf0 {		';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	/* Widths */		';
  html = html + '	.width40, .width54, .width64, .width80, .width84, .width116, .width246, .width248, .width132, .width184, .width312, .width380, .width412, .width448, .width458 {		';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.width40 {		';
  html = html + '		width: 40px;	';
  html = html + '	}		';
  html = html + '	.width54 {		';
  html = html + '		width: 54px;	';
  html = html + '	}		';
  html = html + '	.width64 {		';
  html = html + '		width: 64px;	';
  html = html + '	}		';
  html = html + '	.width80 {		';
  html = html + '		width: 80px;	';
  html = html + '	}		';
  html = html + '	.width84 {		';
  html = html + '		width: 84px;	';
  html = html + '	}		';
  html = html + '	.width132 {		';
  html = html + '		width: 132px;	';
  html = html + '	}		';
  html = html + '	.width116 {		';
  html = html + '		width: 116px;	';
  html = html + '	}		';
  html = html + '	.width184 {		';
  html = html + '		width: 184px;	';
  html = html + '	}		';
  html = html + '	.width246 {		';
  html = html + '		width: 246px;	';
  html = html + '	}		';
  html = html + '	.width248 {		';
  html = html + '		width: 248px;	';
  html = html + '	}		';
  html = html + '	.width312 {		';
  html = html + '		width: 312px;	';
  html = html + '	}		';
  html = html + '	.width380 {		';
  html = html + '		width: 380px;	';
  html = html + '	}		';
  html = html + '	.width412 {		';
  html = html + '		width: 412px;	';
  html = html + '	}		';
  html = html + '	.width448 {		';
  html = html + '		width: 448px;	';
  html = html + '	}		';
  html = html + '	.width458 {		';
  html = html + '		width: 458px;	';
  html = html + '	}		';
  html = html + '	/* Email Container */		';
  html = html + '	.eBox {		';
  html = html + '		width: 544px;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	.bottomCorners {		';
  html = html + '		width: 544px;	';
  html = html + '	}		';
  html = html + '	.bottomCorners {		';
  html = html + '		height: 16px;	';
  html = html + '	}		';
  html = html + '	/* General Button Style */		';
  html = html + '	.eBox .btnMain {		';
  html = html + '		padding-right: 22px;	';
  html = html + '		padding-left: 22px;	';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-bottom: 12px;	';
  html = html + '		height: 20px;	';
  html = html + '		font-size: 18px;	';
  html = html + '		line-height: 20px;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		text-align: center;	';
  html = html + '		vertical-align: middle;	';
  html = html + '	}		';
  html = html + '	/* Main Button */		';
  html = html + '	.mainBtn td {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.mainBtn a {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	/* Light Button */		';
  html = html + '	.lightBtn td {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.lightBtn a {		';
  html = html + '		font-weight: bold;	';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	/* Sublte Button */		';
  html = html + '	.subtleBtn td {		';
  html = html + '		padding-top: 16px;	';
  html = html + '		padding-bottom: 32px;	';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	/* Options Button */		';
  html = html + '	.optionsButton {		';
  html = html + '		width: 152px;	';
  html = html + '		margin-left: auto;	';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnMain {		';
  html = html + '		padding-top: 5px;	';
  html = html + '		padding-bottom: 5px;	';
  html = html + '		padding-left: 6px;	';
  html = html + '		padding-right: 6px;	';
  html = html + '		height: 16px;	';
  html = html + '		line-height: 16px;	';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnMain a, .optionsButton .btnMain span {		';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnIcon {		';
  html = html + '		width: 16px;	';
  html = html + '		height: 16px;	';
  html = html + '		text-align: center;	';
  html = html + '		vertical-align: middle;	';
  html = html + '		padding-top: 5px;	';
  html = html + '		padding-bottom: 5px;	';
  html = html + '		padding-left: 6px;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnIcon img {		';
  html = html + '		width: 16px;	';
  html = html + '		height: 16px;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnIcon a, .optionsButton .btnIcon img {		';
  html = html + '		margin-top: auto;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '		margin-bottom: auto;	';
  html = html + '	}		';
  html = html + '	/* Tag */		';
  html = html + '	.tag .tagName {		';
  html = html + '		font-size: 11px;	';
  html = html + '		text-transform: uppercase;	';
  html = html + '		padding-left: 6px;	';
  html = html + '		padding-right: 6px;	';
  html = html + '		padding-top: 4px;	';
  html = html + '		padding-bottom: 4px;	';
  html = html + '		white-space: nowrap;	';
  html = html + '	}		';
  html = html + '	.tag .tag_space {		';
  html = html + '		background-color: transparent;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		line-height: 100%;	';
  html = html + '		height: 4px;	';
  html = html + '		text-align: left;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	/* Sections */		';
  html = html + '	.eHeader, .highlight, .eBody {		';
  html = html + '		width: 512px;	';
  html = html + '	}		';
  html = html + '	.highlight, .eBody {		';
  html = html + '		padding-top: 16px;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '	}		';
  html = html + '	/* Header */		';
  html = html + '	.eHeader {		';
  html = html + '		padding-top: 16px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo, .eHeaderOptions {		';
  html = html + '		height: 48px;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo, .eHeaderLogo a {		';
  html = html + '		height: 48px;	';
  html = html + '		text-align: left;	';
  html = html + '		font-size: 18px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo a {		';
  html = html + '		line-height: 0;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogo img {		';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogoText {		';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '		padding-top: 10px;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.eHeaderLogoText a {		';
  html = html + '		text-align: left;	';
  html = html + '		font-size: 26px;	';
  html = html + '		line-height: 32px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.eHeaderOptions {		';
  html = html + '		text-align: right;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	/* Footer */		';
  html = html + '	.eFooter {		';
  html = html + '		text-align: center;	';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 21px;	';
  html = html + '		padding-top: 14px;	';
  html = html + '		width: 544px;	';
  html = html + '	}		';
  html = html + '	.eFooter a, .eFooter a span {		';
  html = html + '		text-decoration: underline;	';
  html = html + '	}		';
  html = html + '	.eFooter .highFix, .eFooter .highFix span {		';
  html = html + '		text-decoration: none;	';
  html = html + '		cursor: pointer;	';
  html = html + '	}		';
  html = html + '	/* Highlight Area */		';
  html = html + '	.highlight {		';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	h1 {		';
  html = html + '		font-size: 24px;	';
  html = html + '		line-height: 36px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.highlight p {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.profilePicture, .highlightIcon {		';
  html = html + '		text-align: center;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '		width: 64px;	';
  html = html + '		height: 64px;	';
  html = html + '	}		';
  html = html + '	.profilePicture td {		';
  html = html + '		padding-top: 10px;	';
  html = html + '		padding-bottom: 6px;	';
  html = html + '	}		';
  html = html + '	.highlightIcon td {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.profileName {		';
  html = html + '		font-size: 16px;	';
  html = html + '		line-height: 24px;	';
  html = html + '	}		';
  html = html + '	.profileName span {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.bannerLink a {		';
  html = html + '		display: block;	';
  html = html + '		height: 194px;	';
  html = html + '		line-height: 0;	';
  html = html + '		text-align: center;	';
  html = html + '		font-size: 16px;	';
  html = html + '	}		';
  html = html + '	.bannerLink img {		';
  html = html + '		display: block;	';
  html = html + '		vertical-align: top;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto;	';
  html = html + '	}		';
  html = html + '	/* Content Body */		';
  html = html + '	.eBody p, .eBody li {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '		text-align: left;	';
  html = html + '	}		';
  html = html + '	.eBody p a span {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.quoteTable td {		';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-top: 10px;	';
  html = html + '	}		';
  html = html + '	.aSignature {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 18px;	';
  html = html + '	}		';
  html = html + '	.eBody .aSignature a, .eBody .aSignature a span {		';
  html = html + '		font-weight: normal;	';
  html = html + '	}		';
  html = html + '	/* Content Articles */		';
  html = html + '	h2 {		';
  html = html + '		font-size: 18px;	';
  html = html + '		line-height: 26px;	';
  html = html + '		margin-bottom: 5px;	';
  html = html + '		font-weight: normal;	';
  html = html + '	}		';
  html = html + '	h2 span {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.messageSection .width116, .messageSection .messageArrow, .messageSection .width380 {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '	}		';
  html = html + '	.messageOptions.alignRight {		';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: 0;	';
  html = html + '	}		';
  html = html + '	.bubble table, .bubble table td {		';
  html = html + '		width: 16px;	';
  html = html + '		height: 26px;	';
  html = html + '	}		';
  html = html + '	.bubbleContent {		';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-left: 12px;	';
  html = html + '		padding-right: 12px;	';
  html = html + '	}		';
  html = html + '	.senderProfile .profilePicture td {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 14px;	';
  html = html + '	}		';
  html = html + '	.senderProfile p, .entryBox .senderProfile p {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 19px;	';
  html = html + '	}		';
  html = html + '	.senderProfile a {		';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	/* Invoice #1 */		';
  html = html + '	.invoiceTable td {		';
  html = html + '		padding-bottom: 16px;	';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 19px;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.serviceName {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable .downloadInv {		';
  html = html + '		text-align: center;	';
  html = html + '	}		';
  html = html + '	.downloadInv a {		';
  html = html + '		width: 100%;	';
  html = html + '		margin-left: auto;	';
  html = html + '		margin-right: auto	';
  html = html + '	}		';
  html = html + '	.invoiceTable .amount {		';
  html = html + '		font-weight: bold;	';
  html = html + '		font-size: 16px;	';
  html = html + '		line-height: 24px;	';
  html = html + '	}		';
  html = html + '	/* Invoice #2 */		';
  html = html + '	.invoiceHead, .invoiceHead td, .invoiceHead p {		';
  html = html + '		text-align: left;	';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.invoiceHead p, .invoiceList td {		';
  html = html + '		line-height: 19px;	';
  html = html + '	}		';
  html = html + '	.invoiceHead .amount {		';
  html = html + '		font-weight: bold;	';
  html = html + '		font-size: 16px;	';
  html = html + '	}		';
  html = html + '	h4 {		';
  html = html + '		font-size: 14px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	h4 span {		';
  html = html + '		font-size: 12px;	';
  html = html + '		font-weight: normal;	';
  html = html + '	}		';
  html = html + '	.ihTitle strong, .ihTitle span {		';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable2 th, .invoiceTable2 td {		';
  html = html + '		padding-top: 14px;	';
  html = html + '		padding-bottom: 14px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 16px;	';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 19px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable2 th {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 6px;	';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 16px;	';
  html = html + '		font-weight: bold;	';
  html = html + '		text-transform: uppercase;	';
  html = html + '	}		';
  html = html + '	.servDetails {		';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable2 .subTotal {		';
  html = html + '		font-size: 14px;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.eTotal .amount {		';
  html = html + '		font-size: 16px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	/* Invoice #3 */		';
  html = html + '	.invoiceTable3 th, .invoiceTable3 td {		';
  html = html + '		padding-right: 16px;	';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 th {		';
  html = html + '		padding-top: 6px;	';
  html = html + '		border-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 td {		';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodTitle {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-left: 16px;	';
  html = html + '		border-bottom: 0;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodDesc {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 18px;	';
  html = html + '		padding-right: 0;	';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '		padding-right: 8px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .subTotal, .invoiceTable3 .eTotal {		';
  html = html + '		padding-top: 16px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .eQuantity {		';
  html = html + '		width: 40px;	';
  html = html + '		padding-right: 0;	';
  html = html + '		text-align: center;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .servDetails {		';
  html = html + '		font-size: 11px;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodImg {		';
  html = html + '		padding-left: 16px;	';
  html = html + '		padding-right: 10px;	';
  html = html + '	}		';
  html = html + '	/* Price Tables */		';
  html = html + '	.priceTable .priceColumn {		';
  html = html + '		width: 72px;	';
  html = html + '		padding-right: 1px;	';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '	}		';
  html = html + '	.priceColumn table {		';
  html = html + '		width: 100%;	';
  html = html + '	}		';
  html = html + '	.priceColumn td, .tableOption td {		';
  html = html + '		font-size: 14px;	';
  html = html + '		text-align: center;	';
  html = html + '		padding-top: 12px;	';
  html = html + '		padding-bottom: 12px;	';
  html = html + '		height: 24px;	';
  html = html + '	}		';
  html = html + '	.tableOption td {		';
  html = html + '		line-height: 18px !important;	';
  html = html + '	}		';
  html = html + '	.priceColumn .mobileHide {		';
  html = html + '		line-height: 18px !important;	';
  html = html + '	}		';
  html = html + '	.priceColumn .tableBtn {		';
  html = html + '		border-bottom: 0;	';
  html = html + '		font-size: 12px;	';
  html = html + '	}		';
  html = html + '	.priceColumn .tableBtn a {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.priceColumn th {		';
  html = html + '		font-size: 12px;	';
  html = html + '		line-height: 17px;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		font-weight: normal;	';
  html = html + '		text-align: center;	';
  html = html + '		width: 72px;	';
  html = html + '		height: 60px;	';
  html = html + '		padding-top: 6px;	';
  html = html + '		padding-bottom: 6px;	';
  html = html + '	}		';
  html = html + '	.priceColumn.recommend th {		';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.priceColumn th strong {		';
  html = html + '		font-size: 18px;	';
  html = html + '		line-height: 26px;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		height: 26px;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	.tableOption {		';
  html = html + '		text-align: left;	';
  html = html + '		vertical-align: top;	';
  html = html + '		padding-right: 1px;	';
  html = html + '	}		';
  html = html + '	.tableOption td {		';
  html = html + '		text-align: right;	';
  html = html + '	}		';
  html = html + '	.tableOption th {		';
  html = html + '		display: block;	';
  html = html + '		height: 72px;	';
  html = html + '		font-size: 0;	';
  html = html + '		line-height: 0;	';
  html = html + '		mso-line-height-rule: exactly;	';
  html = html + '		padding-top: 0;	';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '	}		';
  html = html + '	/* Stats */		';
  html = html + '	.twcoList td, .invoiceTable2.twcoList td {		';
  html = html + '		padding-bottom: 0;	';
  html = html + '		padding-top: 10px;	';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		line-height: 22px;	';
  html = html + '	}		';
  html = html + '	.twcoList th, .eBody .twcoList th {		';
  html = html + '		padding-left: 0;	';
  html = html + '	}		';
  html = html + '	.visitStats {		';
  html = html + '		vertical-align: middle;	';
  html = html + '	}		';
  html = html + '	.visitStats table {		';
  html = html + '		margin-top: auto;	';
  html = html + '		margin-bottom: auto;	';
  html = html + '	}		';
  html = html + '	.visitStats td {		';
  html = html + '		padding-top: 5px;	';
  html = html + '		padding-bottom: 5px;	';
  html = html + '		padding-left: 10px;	';
  html = html + '		padding-right: 10px;	';
  html = html + '		font-size: 14px;	';
  html = html + '	}		';
  html = html + '	.visitStats .visitPro {		';
  html = html + '		padding-left: 0;	';
  html = html + '		padding-right: 0;	';
  html = html + '		width: 46px;	';
  html = html + '		text-align: center;	';
  html = html + '		font-weight: bold;	';
  html = html + '	}		';
  html = html + '	/* Text Colors */		';
  html = html + '	a, a span, .tableBtn a span, .priceColumn td a span {		';
  html = html + '		color: #ff9826;	';
  html = html + '	}		';
  html = html + '	.entryBox p, .eBody, .invoiceTable td, .invoiceTable p, .invoiceTable2 th, .invoiceTable2 td, .invoiceTable2 p, .priceTable td, .priceTable th, .priceTable p, h4, .subTotal .amount, .invoiceHead .amount, .twcoList strong, .eBody .twcoList strong, .priceColumn td span {		';
  html = html + '		color: #242424;	';
  html = html + '	}		';
  html = html + '	.mainBtn a, .mainBtn a span, .tag .tagName, .secondaryBtn a, .secondaryBtn a span, .lightBtn a, .lightBtn span, .defaultBtn a, .defaultBtn a span, .priceColumn.recommend th, .priceColumn.recommend th strong, .priceColumn.recommend th span, .visitStats .visitPro {		';
  html = html + '		color: #ffffff;	';
  html = html + '	}		';
  html = html + '	.eFooter, .eFooter .highFix, .eFooter .highFix span {		';
  html = html + '		color: #b2b2b2;	';
  html = html + '	}		';
  html = html + '	.eFooter a, .eFooter a span {		';
  html = html + '		color: #808080;	';
  html = html + '	}		';
  html = html + '	.optionsButton .btnMain a, .optionsButton .btnMain span {		';
  html = html + '		color: #ffffff;	';
  html = html + '	}		';
  html = html + '	.highlight p, .psMsg, .senderProfile p, .entryBox .senderProfile p, .invoiceHead, .invoiceHead td, .invoiceHead p, .invoiceTable2 .subTotal, .servDetails, .aSignature, .eBody .aSignature a, .eBody .aSignature a span, h4 span, .invoiceTable2 th, .twcoList td, .invoiceTable2.twcoList td, .priceTable .tableBtn, .priceColumn span, .invoiceTable3 .prodDesc, .label, .subtleBtn td, .subtleBtn td a, .subtleBtn td a span {		';
  html = html + '		color: #898989;	';
  html = html + '	}		';
  html = html + '	h1, h1 span, h2, h2 span, .invoiceHead .ihBlack, span.serviceName {		';
  html = html + '		color: #242424;	';
  html = html + '	}		';
  html = html + '	.priceTable th strong, .amount, .priceColumn.recommend, .priceTable .spBtn, .priceTable .spBtn span, .profileName, .profileName span, .invoiceTable .amount, .bannerLink a {		';
  html = html + '		color: #666666;	';
  html = html + '	}		';
  html = html + '	.quoteTable td {		';
  html = html + '		color: #898989;	';
  html = html + '	}		';
  html = html + '	/* Background Colors */		';
  html = html + '	.defaultBtn td {		';
  html = html + '		background-color: #7d7d7d;	';
  html = html + '	}		';
  html = html + '	.priceColumn.recommend th {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.topCorners td, .eHeader, .bottomCorners, .ReadMsgBody, .ExternalClass, .eBody, .invoiceTable2, .invoiceTable2 td, .invoiceTable2 th, .priceColumn.recommend .tableBtn {		';
  html = html + '		background-color: #ffffff;	';
  html = html + '	}		';
  html = html + '	.priceColumn .tableBtn, .priceColumnRec .tableBtn {		';
  html = html + '		border-bottom: 0 soldi #ffffff; /* same as above */	';
  html = html + '	}		';
  html = html + '	body, #emailBody, .emailBodyCell {		';
  html = html + '		background-color: #f2f2f2;	';
  html = html + '	}		';
  html = html + '	.optionsButton td {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.highlight, .bubble td, .bubble table td, .invoiceTable2 .subTotal, .priceColumn th, .priceColumn.recommend td {		';
  html = html + '		background-color: #fafafa;	';
  html = html + '	}		';
  html = html + '	.visitStats .visitPro {		';
  html = html + '		background-color: #242424;	';
  html = html + '	}		';
  html = html + '	.mainBtn td {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor1 {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.tag td {		';
  html = html + '		background-color: #cbcbcb;	';
  html = html + '	}		';
  html = html + '	.lightBtn td {		';
  html = html + '		background-color: #f6ba78;	';
  html = html + '	}		';
  html = html + '	.secondaryBtn td {		';
  html = html + '		background-color: #bebebe;	';
  html = html + '	}		';
  html = html + '	.bubble2 td {		';
  html = html + '		background-color: #fafafa;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor2 {		';
  html = html + '		background-color: #7d7d7d;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor3 {		';
  html = html + '		background-color: #cbcbcb;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor4 {		';
  html = html + '		background-color: #ef954d;	';
  html = html + '	}		';
  html = html + '	.visitStats .statColor5 {		';
  html = html + '		background-color: #a478e5;	';
  html = html + '	}		';
  html = html + '	/* Borders */		';
  html = html + '	.eHeader, .highlight, .subTotal, .bottomLine, .invoiceTable2 th, .eTotal {		';
  html = html + '		border-bottom: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.invoiceTable3 .prodTitle {		';
  html = html + '		border-top: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.quoteTable td {		';
  html = html + '		border-left: 6px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.tableOption td, .tableOption th, .priceColumn td, .priceColumn th {		';
  html = html + '		border-bottom: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	.priceColumn.recommend th {		';
  html = html + '		border-bottom: 1px solid #ebebeb;	';
  html = html + '	}		';
  html = html + '	 @media only screen {		';
  html = html + '	td[class=btnMain] {		';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnMain] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 10px 22px !important;	';
  html = html + '		line-height: 26px !important;	';
  html = html + '	}		';
  html = html + '	table[class=tag] td {		';
  html = html + '		border-collapse: separate !important;	';
  html = html + '	}		';
  html = html + '	td[class=tagName], td[class~=invoiceHead] td[class=tagName] {		';
  html = html + '		font-size: 11px !important;	';
  html = html + '		line-height: 14px !important;	';
  html = html + '	}		';
  html = html + '	table[class=optionsButton] {		';
  html = html + '		width: auto !important;	';
  html = html + '	}		';
  html = html + '	table[class=optionsButton] td[class=btnMain] a {		';
  html = html + '		padding: 7px 4px 7px 6px !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnIcon] {		';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnIcon] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 6px 2px 6px 7px !important;	';
  html = html + '	}		';
  html = html + '	table[class=subtleBtn] td {		';
  html = html + '		padding: 9px 0 25px !important;	';
  html = html + '	}		';
  html = html + '	table[class=subtleBtn] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 7px 8px !important;	';
  html = html + '	}		';
  html = html + '	}		';
  html = html + '	 @media only screen and (max-width: 600px) {		';
  html = html + '	td[class=emailBodyCell] {		';
  html = html + '		padding-left: 0 !important;	';
  html = html + '		padding-right: 0 !important;	';
  html = html + '	}		';
  html = html + '	}		';
  html = html + '	 @media only screen and (max-width: 560px) {		';
  html = html + '	td[class=emailBodyCell] {		';
  html = html + '		padding: 8px !important;	';
  html = html + '	}		';
  html = html + '	table[id=emailBody], td[class=emailBodyCell], table[class=eBox], td[class=highlight], td[class~=highlight], td[class=eBody], td[class~=eBody], div[class=bannerLink] a, div[class=bannerLink] img {		';
  html = html + '		display: block !important;	';
  html = html + '		width: auto !important;	';
  html = html + '	}		';
  html = html + '	td[class=highlight], td[class~=highlight], td[class=eBody], td[class~=eBody] {		';
  html = html + '		overflow: hidden !important;	';
  html = html + '	}		';
  html = html + '	td[class=width40], td[class~=width40], td[class=width54], td[class~=width54], td[class=width64], td[class~=width64], td[class=width80], td[class~=width80], td[class=width84], td[class~=width84], td[class=width116], td[class~=width116], td[class=width246], td[class~=width246], td[class=width248], td[class~=width248], td[class=width132], td[class~=width132], td[class=width184], td[class~=width184], td[class=width312], td[class~=width312], td[class=width380], td[class~=width380], td[class=width412], td[class~=width412], td[class=width448], td[class~=width448], td[class=width458], td[class~=width458], td[class=priceColumn], td[class~=priceColumn], td[class~=subTotal], table[class=invoiceList] td, td[class=width184], td[class~=width184], table[class=entryBox] td[class=alignLeft], table[class=invoiceTable] td[class~=alignLeft], table[class=invoiceTable] td[class=alignRight], td[class~=invoiceHead] table, td[class~=invoiceHead] td[class=alignLeft], table[class~=messageSection], td[class~=senderProfile], td[class~=messageArrow], td[class~=prodDesc], td[class~=eQuantity], td[class~=highlight] td[class=alignLeft], table[class=statsData] td[class~=width248] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		display: block !important;	';
  html = html + '		padding-right: 0 !important;	';
  html = html + '	}		';
  html = html + '	div[class=bannerLink] a {		';
  html = html + '		height: auto !important;	';
  html = html + '	}		';
  html = html + '	div[class=bannerLink] a, div[class=bannerLink] img {		';
  html = html + '		width: 100% !important;	';
  html = html + '	}		';
  html = html + '	td[class=highlight] h1, td[class~=highlight] h1 {		';
  html = html + '		font-size: 28px !important;	';
  html = html + '		line-height: 36px !important;	';
  html = html + '	}		';
  html = html + '	td[class=eBody] h2, td[class~=eBody] h2, td[class=priceColumn] th, td[class~=priceColumn] th strong {		';
  html = html + '		font-size: 22px !important;	';
  html = html + '		line-height: 30px !important;	';
  html = html + '		margin-bottom: 8px !important;	';
  html = html + '	}		';
  html = html + '	strong[class=amount], td[class~=eTotal] span[class=amount] {		';
  html = html + '		font-size: 20px !important;	';
  html = html + '		line-height: 24px !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnMain] a {		';
  html = html + '		font-size: 20px;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] th, td[class~=priceColumn] th, td[class~=prodTitle] h4, td[class~=invoiceHead] p[class=amount] {		';
  html = html + '		font-size: 18px !important;	';
  html = html + '		line-height: 26px !important;	';
  html = html + '	}		';
  html = html + '	td[class=eBody] p, td[class~=eBody] p, td[class=highlight] p, td[class~=highlight] p, table[class=invoiceTable2] td, table[class~=invoiceTable2] td, span[class=serviceName], td[class=priceColumn] td, td[class~=priceColumn] td, td[class~=highlight] h4, table[class=subtleBtn] a {		';
  html = html + '		font-size: 16px !important;	';
  html = html + '		line-height: 24px !important;	';
  html = html + '	}		';
  html = html + '	td[class=eBody] p, td[class~=eBody] p, td[class=highlight] p, td[class~=highlight] p {		';
  html = html + '		margin-bottom: 18px;	';
  html = html + '	}		';
  html = html + '	td[class~=invoiceHead] td, td[class~=invoiceHead] p, span[class=aSignature], td[class~=highlight] h4 span, span[class=servDetails] {		';
  html = html + '		font-size: 14px !important;	';
  html = html + '		line-height: 21px !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable] td {		';
  html = html + '		font-size: 13px !important;	';
  html = html + '		line-height: 21px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] td {		';
  html = html + '		line-height: 30px !important;	';
  html = html + '	}		';
  html = html + '	td[class=btnIcon] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 12px 12px !important;	';
  html = html + '	}		';
  html = html + '	td[class=highlight], td[class~=highlight], td[class=eBody], td[class~=eBody] {		';
  html = html + '		padding-top: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=entryBox] td[class=width132], table[class=entryBox] td[class~=width132] {		';
  html = html + '		text-align: center !important;	';
  html = html + '	}		';
  html = html + '	table[class~=messageSection], table[class=entryBox] td[class=width132] a img, table[class=entryBox] td[class~=width132] a img {		';
  html = html + '		margin-top: 16px !important;	';
  html = html + '		margin-bottom: 16px !important;	';
  html = html + '	}		';
  html = html + '	td[class~=highlight] td[class~=width116], td[class=highlight] table[class=invoiceTable] td[class~=downloadInv] {		';
  html = html + '		text-align: center !important;	';
  html = html + '	}		';
  html = html + '	td[class~=highlight] table[class=invoiceList] td[class~=width116], table[class=invoiceTable] td[class~=width116] {		';
  html = html + '		text-align: left !important;	';
  html = html + '	}		';
  html = html + '	td[class~=highlight] td[class~=width116] img {		';
  html = html + '		margin-top: 16px !important;	';
  html = html + '		margin-bottom: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=profilePicture] td {		';
  html = html + '		padding-top: 8px !important;	';
  html = html + '		padding-bottom: 4px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=messageSection] td[class=width380] {		';
  html = html + '		padding-bottom: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] {		';
  html = html + '		padding-bottom: 0 !important;	';
  html = html + '		text-align: center !important;	';
  html = html + '		vertical-align: top !important;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '		height: 26px !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] table {		';
  html = html + '		transform: rotate(90deg) !important;	';
  html = html + '		-ms-transform: rotate(90deg) !important;	';
  html = html + '		-webkit-transform: rotate(90deg) !important;	';
  html = html + '		margin-right: auto !important;	';
  html = html + '		margin-left: auto !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] table[class=bubble] {		';
  html = html + '		margin-top: 5px !important;	';
  html = html + '	}		';
  html = html + '	td[class~=messageArrow] table[class=bubble2] {		';
  html = html + '		margin-top: -5px !important;	';
  html = html + '	}		';
  html = html + '	table[class=messageOptions], table[class~=messageOptions] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '	}		';
  html = html + '	table[class=messageOptions] td[class=moBtn], table[class~=messageOptions] td[class~=moBtn], table[class=statsData] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		margin: 0 !important;	';
  html = html + '		float: left !important;	';
  html = html + '		margin-top: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable2], table[class~=invoiceTable2] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		margin: 0 !important;	';
  html = html + '		float: left !important;	';
  html = html + '	}		';
  html = html + '	table[class=mainBtn], table[class~=mainBtn], table[class=secondaryBtn], table[class~=secondaryBtn], table[class=defaultBtn], table[class~=defaultBtn], table[class=lightBtn], table[class~=lightBtn], table[class=subtleBtn] {		';
  html = html + '		width: 100% !important;	';
  html = html + '		margin: 0 !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable2] td, table[class~=invoiceTable2] td {		';
  html = html + '		-webkit-box-sizing: border-box !important;	';
  html = html + '		-moz-box-sizing: border-box !important;	';
  html = html + '		box-sizing: border-box !important;	';
  html = html + '		text-align: left !important;	';
  html = html + '		padding-right: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class=invoiceTable2] td[class=width312] {		';
  html = html + '		border-top: 1px solid #ebebeb !important;	';
  html = html + '		padding-top: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td[class~=prodImg] {		';
  html = html + '		height: 1px !important;	';
  html = html + '		position: relative !important;	';
  html = html + '		overflow: visible !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class~=prodImg] img {		';
  html = html + '		position: absolute !important;	';
  html = html + '		right: 16px !important;	';
  html = html + '		top: 0 !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td {		';
  html = html + '		padding-left: 16px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td[class~=prodDesc] {		';
  html = html + '		padding-right: 112px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=invoiceTable3] td[class~=prodDesc] {		';
  html = html + '		font-size: 14px !important;	';
  html = html + '		line-height: 21px !important;	';
  html = html + '	}		';
  html = html + '	 td[class=width248 pdBt16 pdRg16 alignCenter], td[class=highlight pdBt16 alignLeft] td[class=width116 pdRg16], td[class=highlight pdBt16 alignLeft] td[class=alignLeft] {		';
  html = html + '	 padding-right: 0 !important;		';
  html = html + '	 text-align: center !important;		';
  html = html + '	}		';
  html = html + '	 td[class=width248 pdBt16 pdRg16 alignCenter] img, td[class=highlight pdBt16 alignLeft] td[class=width116 pdRg16] img {		';
  html = html + '	 display: inline-block !important;		';
  html = html + '	}		';
  html = html + '	td[class~=senderProfile], table[class=bubble] td[class=width380] {		';
  html = html + '		padding-bottom: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class~=senderProfile] p {		';
  html = html + '		margin-bottom: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn], td[class~=priceColumn] {		';
  html = html + '		padding-bottom: 32px !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] th, td[class~=priceColumn] th {		';
  html = html + '		padding: 16px 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] td, td[class~=priceColumn] td {		';
  html = html + '		border: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] td[class=tableBtn] {		';
  html = html + '		padding: 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] img, td[class~=priceColumn] img {		';
  html = html + '		vertical-align: top !important;	';
  html = html + '		margin: 2px 6px 0 0 !important;	';
  html = html + '	}		';
  html = html + '	td[class=priceColumn] a, td[class~=priceColumn] a {		';
  html = html + '		display: block !important;	';
  html = html + '		padding: 10px !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] th {		';
  html = html + '		padding-top: 16px !important;	';
  html = html + '		padding-right: 0 !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] td[class=width116], table[class~=twcoList] td[class~=width116] {		';
  html = html + '		padding-right: 0 !important;	';
  html = html + '		display: table-cell !important;	';
  html = html + '		width: 60% !important;	';
  html = html + '	}		';
  html = html + '	table[class~=twcoList] td[class~=pdLf16] {		';
  html = html + '		width: 40% !important;	';
  html = html + '	}		';
  html = html + '	span[class=desktopHide] {		';
  html = html + '		display: inline-block !important;	';
  html = html + '		font-size: inherit !important;	';
  html = html + '		max-height: none !important;	';
  html = html + '		line-height: inherit !important;	';
  html = html + '		padding-right: 6px !important;	';
  html = html + '		overflow: visible !important;	';
  html = html + '		width: auto !important;	';
  html = html + '	}		';
  html = html + '	td[class=mobileHide], td[class~=mobileHide], td[class=tableOption], table[class=invoiceTable2] th, table[class~=invoiceTable3] th {		';
  html = html + '		display: none !important;	';
  html = html + '		font-size: 0 !important;	';
  html = html + '		width: 0 !important;	';
  html = html + '		max-height: 0 !important;	';
  html = html + '		line-height: 0 !important;	';
  html = html + '		padding: 0 !important;	';
  html = html + '		overflow: hidden !important;	';
  html = html + '	}		';
  html = html + '	}		';
  html = html + '	</style>		';
  html = html + '	<style type="text/css">		';
  html = html + '	</style>		';
  html = html + '	</head>		';
  html = html + '	<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: 100%;width: 100%;min-height: 1000px;background-color: #f2f2f2;">		';
  html = html + '	<div class="emailSummary" style="mso-hide: all;display: none !important;font-size: 0 !important;max-height: 0 !important;line-height: 0 !important;padding: 0 !important;overflow: hidden !important;float: none !important;width: 0 !important;height: 0 !important;">Your account is now activated. Start selling your products.</div>		';
  html = html + '	<table id="emailBody" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;height: 100%;width: 100%;min-height: 1000px;background-color: #f2f2f2;">		';
  html = html + '	  <tr>		';
  html = html + '	    <td align="center" valign="top" class="emailBodyCell" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 32px;padding-bottom: 32px;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;height: 100%;width: 100%;min-height: 1000px;background-color: #f2f2f2;"><table width="544" border="0" cellpadding="0" cellspacing="0" class="eBox" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;width: 544px;">		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="eHeader" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 16px;padding-bottom: 16px;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;width: 512px;background-color: #ffffff;border-bottom: 1px solid #ebebeb;"><table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td class="eHeaderLogo" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;height: 48px;text-align: left;font-size: 0 !important;font-weight: bold;"><a href="#" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ff9826;height: 48px;text-align: left;font-size: 18px;font-weight: bold;line-height: 0;"><img class="imageFix" src="http://ec2-54-85-218-20.compute-1.amazonaws.com/modules/core/client/img/brand/mm_Logo.png" width="200" height="48" alt="mightymerce" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: auto;width: auto;line-height: 100%;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;border: none;display: block;vertical-align: top;"></a></td>		';
  html = html + '	                <!-- end .eHeaderLogo-->		';
  //html = html + '	                <td class="eHeaderOptions" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;height: 48px;text-align: right;vertical-align: top;font-size: 0 !important;"><table border="0" cellpadding="0" cellspacing="0" class="optionsButton" align="right" style="margin-top: 0;margin-left: auto;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;width: 152px;text-align: left;">		';
  //html = html + '	                    <tr>		';
  //html = html + '	                      <td class="btnIcon" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 5px;padding-bottom: 5px;padding-left: 6px;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;background-color: #ffffff;width: 16px;height: 16px;text-align: center;vertical-align: middle;"><a href="#" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ffffff;margin-top: auto;margin-left: auto;margin-right: auto;margin-bottom: auto;"><img src="" width="16" height="16" alt="Options" style="margin-top: auto;margin-left: auto;margin-right: auto;margin-bottom: auto;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: 16px;width: 16px;line-height: 100%;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;border: none;"></a></td>		';
  //html = html + '	                      <td class="btnMain mobileHide" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 5px;padding-bottom: 5px;padding-left: 6px;padding-right: 6px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;background-color: #ffffff;height: 16px;font-size: 18px;line-height: 16px;mso-line-height-rule: exactly;text-align: left;vertical-align: middle;"><a href="#" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ffffff;font-size: 12px;"><span style="text-decoration: none;color: #ffffff;font-size: 12px;"></span></a></td>		';
  //html = html + '	                    </tr>		';
  //html = html + '	                  </table></td>		';
  html = html + '	                <!-- end .eHeaderOptions--> 		';
  html = html + '	              </tr>		';
  html = html + '	            </table></td>		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="highlight pdTp32" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 32px;padding-bottom: 0;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;width: 512px;text-align: center;background-color: #fafafa;border-bottom: 1px solid #ebebeb;"><h1 style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 5px;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;font-size: 24px;line-height: 36px;font-weight: bold;color: #242424;"><span style="color: #242424;">Welcome to mightymerce</span></h1>		';
  html = html + '	            <table border="0" align="center" cellpadding="0" cellspacing="0" class="profilePicture" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;text-align: center;width: 64px;height: 64px;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 10px;padding-bottom: 6px;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;"><img src="http://ec2-54-85-218-20.compute-1.amazonaws.com/modules/core/client/img/user_icon.png" width="64" height="64" alt="Your Profile Picture" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;height: auto;width: auto;line-height: 100%;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"></td>		';
  html = html + '	              </tr>		';
  html = html + '	            </table>		';
  html = html + '	            <p class="profileName" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 24px;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;font-size: 14px;line-height: 22px;color: #898989;"><span style="font-weight: bold;color: #666666;">' + inputData.usereMail + '</span><br>		';
  html = html + '	              </p></td>		';
  html = html + '	          <!-- end .highlight--> 		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="eBody alignCenter pdTp32" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 32px;padding-bottom: 0;padding-left: 16px;padding-right: 16px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;text-align: center;width: 512px;color: #242424;background-color: #ffffff;"><p style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 24px;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;text-align: center;font-size: 14px;line-height: 22px;">You successfully activated your mightymerce account.<br>		';
  html = html + '	              Click the button to start selling your products ...</p>		';
  html = html + '	            <table border="0" cellpadding="0" cellspacing="0" class="mainBtn" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td align="center" valign="middle" class="btnMain" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 12px;padding-bottom: 12px;padding-left: 22px;padding-right: 22px;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;background-color: #f6ba78;height: 20px;font-size: 18px;line-height: 20px;mso-line-height-rule: exactly;text-align: center;vertical-align: middle;"><a href="' + link + '" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #ffffff;font-weight: bold;"><span style="text-decoration: none;color: #ffffff;">Go to your mightymerce store</span></a></td>		';
  html = html + '	              </tr>		';
  html = html + '	            </table>		';
  html = html + '	            <table align="center" border="0" cellpadding="0" cellspacing="0" class="subtleBtn" style="margin-top: 0;margin-left: auto;margin-right: auto;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;border-collapse: collapse;border-spacing: 0;">		';
  html = html + '	              <tr>		';
  html = html + '	                <td style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 16px;padding-bottom: 32px;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;font-size: 14px;color: #898989;"><a href="" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #898989;"><span style="text-decoration: none;color: #898989;"></span></a></td>		';
  html = html + '	              </tr>		';
  html = html + '	            </table></td>		';
  html = html + '	          <!-- end .eBody--> 		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="bottomCorners" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;width: 544px;height: 16px;background-color: #ffffff;">&nbsp;</td>		';
  html = html + '	        </tr>		';
  html = html + '	        <tr>		';
  html = html + '	          <td class="eFooter" style="margin-top: 0;margin-left: 0;margin-right: 0;margin-bottom: 0;padding-top: 14px;padding-bottom: 0;padding-left: 0;padding-right: 0;border-collapse: collapse;border-spacing: 0;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;text-align: center;font-size: 12px;line-height: 21px;width: 544px;color: #b2b2b2;">© 2016 mightymerce. All Rights Reserved. <br>		';
  html = html + '	            <a href="#" class="highFix" style="padding-top: 0;padding-bottom: 0;padding-left: 0;padding-right: 0;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;font-family: Arial, Helvetica, sans-serif;color: #b2b2b2;cursor: pointer;"><span style="text-decoration: none;color: #b2b2b2;cursor: pointer;">Frankfurt • Germany</span></a></td>		';
  html = html + '	        </tr>		';
  html = html + '	      </table>		';
  html = html + '	      		';
  html = html + '	      <!-- end .eBox --></td>		';
  html = html + '	    <!-- end .emailBodyCell --> 		';
  html = html + '	  </tr>		';
  html = html + '	</table>		';
  html = html + '	<!-- end #emailBody -->		';
  html = html + '	</body>		';
  html = html + '	</html>		';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'mightymerce | registration <noreply@mightymerce.com>', // sender address
    to: inputData.usereMail, // list of receivers
    subject: 'Welcome to mightymerce. Your account is set up. Start selling now!', // Subject line
    text: '', // plaintext body
    html: html
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('users.authentication.server.controller - sendwelcomeemail - sent mail success');
    return res.json('success');
  });

  // setup e-mail data with unicode symbols
  var mailOptionsIntern = {
    from: 'mightymerce | registration <noreply@mightymerce.com>', // sender address
    to: 'registration@mightymerce.com', // list of receivers
    subject: 'Neuer Nutzer bei Mightymerce', // Subject line
    text: 'Eben hat ' + inputData.usereMail + ' seinen Account aktiviert.' // plaintext body
  };

  if(req.get('host') === 'shop.mightymerce.com'){
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptionsIntern, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('users.authentication.server.controller - sendwelcomeemail - sent mail success');
      return res.json('success');
    });
  }

};
