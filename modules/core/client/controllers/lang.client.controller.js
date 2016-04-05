'use strict';

angular.module('core').controller('LangCtrl', function ($scope, $translate) {

    $scope.changeLang = function (key) {
        $translate.use(key).then(function (key) {
            console.log("Sprache zu " + key + " gewechselt.");
        }, function (key) {
            console.log("Irgendwas lief schief.");
        });
    };
});/**
 * Created by mwagner on 21.03.16.
 */
