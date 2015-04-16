'use strict';

var icons = require('./icons');

function MainController () {

}

angular.module('app', [ 'ngMaterial', 'ui.router' ])
   .config(function ($mdThemingProvider, $mdIconProvider) {
        $mdThemingProvider.theme('default')
           .primaryPalette('brown')
           .accentPalette('blue');

        icons.setup($mdIconProvider);
    })
   .controller('MainController', MainController);
