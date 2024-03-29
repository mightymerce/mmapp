'use strict';

module.exports = {
  client: {
    lib: {
      css: [
      ],
      js: [
        // JQuery
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/jquery/jquery-ui.custom.min.js',
        'public/lib/jquery/jquery-ui/jquery-ui.min.js',
        'public/lib/jquery/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',

        // Angular
        'public/lib/angular/angular.js',
        //'public/lib/angular/angular.min.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        'public/lib/angular-translate-storage-local/angular-translate-storage-local.js',
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

        // SlimScroll
        'public/lib/plugin/slimscroll/jquery.slimscroll.min.js',

        // Metis Menu
        'public/lib/plugin/metisMenu/metisMenu.min.js',

        // Peity
        'public/lib/plugin/peity/jquery.peity.min.js',

        // Inspinia
        'public/inspinia.js',

        // Peace JS
        'public/lib/plugin/pace/pace.min.js',

        // iCheck
        'public/lib/plugin/iCheck/icheck.min.js',

        // Sweet Aöer
        'public/lib/plugin/iCheck/icheck.min.js',

        // Footable
        'public/lib/css/plugins/footable/footable.all.min.js',
        'public/lib/css/plugins/footable/angular-footable.js',

        // OWASP password
        'public/lib/plugin/owasp-password-strength-test/owasp-password-strength-test.js',

        // Main Angular scripts
        'public/lib/plugin/oclazyload/dist/ocLazyLoad.min.js',
        'public/lib/ui-bootstrap-tpls-0.12.0.min.js',

        // Facebook
        'public/openfb-angular.js',

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
        'public/lib/plugin/checkout/script.js',

        // Social Media Icon - Sharrif
        //'public/lib/plugin/shariff/shariff.min.js'

        'public/lib/angular-socialshare/dist/angular-socialshare.js',

        // textAngular - wysywig
        'public/lib/textAngular/dist/textAngular-rangy.min.js',
        'public/lib/textAngular/dist/textAngular-sanitize.min.js',
        'public/lib/textAngular/dist/textAngular.min.js'
      ]
    },
    css:
        [
          'modules/products/client/cropper/assets/css/*.css',
          'modules/products/client/cropper/dist/cropper.css',
          'modules/products/client/cropper/main.css',
          'public/dist/application.min.css'
        ],

    js:
        [
          'modules/core/client/app/config.js',
          'modules/core/client/app/init.js',
          'modules/*/client/*.js',
          'modules/*/client/**/*.js',
          'modules/users/client/assets/js/*.js',
          'public/dist/application.min.js'

        ]

  }
};
