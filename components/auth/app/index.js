'use strict';

var App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.Router.map(function () {
    this.route('login');
    this.route('signup');
});

App.IndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('login');
    }
});

window.App = App; // TODO: module.export
