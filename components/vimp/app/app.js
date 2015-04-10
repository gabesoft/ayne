'use strict';

angular.module('app', []);

// TODO: fix this
angular.element(document).ready(function () {
    setTimeout(function () {
        angular.bootstrap(document.getElementsByTagName('body'), ['app']);
    });
});
