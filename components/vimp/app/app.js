'use strict';

function MainController () {

}

angular.module('app', [ 'ngMaterial', 'ngMdIcons', 'ui.router' ])
   .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
           .primaryPalette('brown')
           .accentPalette('blue');
    })
   .controller('MainController', MainController);
