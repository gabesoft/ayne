import App from 'app';

App.ApplicationView = Ember.View.extend({
    initFoundation: function () {
        Ember.$(document).foundation();
    }.on('didInsertElement')
});
