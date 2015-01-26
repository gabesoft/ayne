var Router = Ember.Router.extend({
        rootURL  : '/'
      , location : 'history'
    });

Router.map(function () {
    this.route('oauth2callback');
});

export default Router;
