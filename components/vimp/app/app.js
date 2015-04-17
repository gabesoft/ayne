'use strict';

var icons      = require('./icons')
  , Vplug      = require('./controllers/vplug')
  , ApiFactory = require('./services/api')
  , module     = angular.module('app', ['ngMaterial', 'ui.router']);



module.config(function ($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
       .primaryPalette('brown')
       .accentPalette('blue');

    icons.setup($mdIconProvider);
});

module.controller('VplugController', Vplug);
module.factory('ApiService', ApiFactory);
