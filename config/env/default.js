'use strict';

module.exports = {
  app: {
    title: 'MEAN.JS',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.googleAnalyticsTrackingID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.sessionSecret || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1024*1024 // Max file size in bytes (1 MB)
      }
    },

    // currently not used - maintained in users.profile.server.controller.js
    productImageUpload: {
      dest: './modules/products/client/img/products/uploads/', // Product main Image
      limits: {
        fileSize: 1024*1024 // Max file size in bytes (1 MB)
      }
    }
  },
  assets: {
    lib: {
      css: [
        // Bootstrap
        'public/lib/bootstrap/dist/css/bootstrap.css',
        //'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        // Font Awsome
        'public/lib/font-awesome/css/*.css',
        // Metis Menu
        'public/lib/plugin/metisMenu/metisMenu.min.css',
        // Footable
        'public/lib/css/plugins/footable/footable.core.css',

        // Inspinia
        'public/css/style.css',
        //'public/css/style.min.css',

        // Checkout
        //'public/css/core.css',

        // Image cropper
        'public/lib/plugin/cropper/cropper.min.css',

        // Cropper
        'public/lib/cropper/assets/css/font-awesome.min.css'
        //'public/lib/cropper/assets/css/bootstrap.min.css',
        //'public/lib/cropper/assets/css/tooltip.min.css',
        //'public/lib/cropper/dist/cropper.css',
        //'public/lib/cropper/main.css'

        // Social Media Icon - Shariff
        //'public/lib/plugin/shariff/shariff.min.css'


      ],
      js: [
        // JQuery
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/jquery/jquery-ui.custom.min.js',
        'public/lib/jquery/jquery-ui/jquery-ui.min.js',
        'public/lib/jquery/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',

        // Angular
        'public/lib/angular/angular.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'public/lib/angular-translate-storage-local/angular-translate-storage-local.min.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-idle/angular-idle.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap.js',
        'public/lib/angular-bootstrap/ui-bootstrap.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-route/angular-route.js',
        'public/lib/angular-css/angular-css.min.js',

        // Bootstrap
        'public/lib/bootstrap/dist/js/bootstrap.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',

        // i18n Formatting on locales
        'public/lib/angular-i18n/angular-locale_de-de.js',

        // SlimScroll
        'public/lib/plugin/slimscroll/jquery.slimscroll.min.js',

        // Metis Menu
        'public/lib/plugin/metisMenu/jquery.metisMenu.min.js',

        // Peity
        'public/lib/plugin/peity/jquery.peity.min.js',

        // Inspinia
        'public/inspinia.js',

        // Peace JS
        'public/lib/plugin/pace/pace.min.js',

        // iCheck
        'public/lib/plugin/iCheck/icheck.min.js',

        // Footable
        'public/lib/css/plugins/footable/footable.all.min.js',
        'public/lib/css/plugins/footable/angular-footable.js',

        // Cropper
        //'public/lib/plugin/cropper/assets/js/jquery.min.js',
        //'public/lib/cropper/assets/js/tooltip.min.js',
        //'public/lib/plugin/cropper/assets/js/bootstrap.min.js',
        //'public/lib/plugin/cropper/dist/cropper.js',

        // OWASP password
        'public/lib/plugin/owasp-password-strength-test/owasp-password-strength-test.js',

        // Main Angular scripts
        'public/lib/plugin/oclazyload/dist/ocLazyLoad.min.js',
        'public/lib/ui-bootstrap-tpls-0.12.0.min.js',



        // Facebook
        'public/openfb-angular.js',

        // Image cropper
        'public/lib/plugin/cropper/cropper.min.js',

        // Angular SOAP
        'public/lib/plugin/angular-soap/soapclient.js',
        'public/lib/plugin/angular-soap/angular.soap.js',


        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',

        // Flot
        //'public/lib/plugin/flot/jquery.flot.js',
        //'public/lib/plugin/flot/jquery.flot.tooltip.min.js',
        //'public/lib/plugin/flot/jquery.flot.resize.js',
        //'public/lib/plugin/flot/jquery.flot.pie.js',

        // ChartJS
        'public/lib/plugin/chartJs/Chart.min.js',

        // ngTouchspin
        'public/lib/ngTouchSpin/src/js/ngTouchSpin.js',

        // Checkout
        'public/lib/plugin/jsnumberformatter/jsnumberformatter.js',
        'public/lib/plugin/jsnumberformatter/jsnumberformatter.locale.js',
        'public/lib/plugin/jsnumberformatter/jsnumberformatter.locale.decimal.superset.js',
        'public/lib/plugin/checkout/jquery.shorten.js',
        'public/lib/plugin/checkout/validator.min.js',
        'public/lib/plugin/checkout/script.js'

        // Social Media Icon - Sharrif
        //'public/lib/plugin/shariff/shariff.min.js'

      ]
    },
    css: [
      //'modules/core/client/css/*.css',
      'modules/users/client/assets/css/*.css'

    ],
    js: [
      'config/config.js',
      'config/lib/*.js',
      'config/env/*.js',
      'modules/*/*/*/*.js',
      'modules/*/*[!tests]*/*/*.js',
      //'modules/checkouts/client/libs/*.js',
      //'modules/checkouts/client/libs/jsnumberformatter/*.js'
      'modules/users/client/assets/js/*.js'

    ],
    tests: [
      'public/lib/angular-mocks/angular-mocks.js',
      'modules/*/tests/*/*.js'
    ]
  }
};
