var Router = Ember.Router.extend({
        rootURL  : '/'
      , location : 'history'
    });

Router.map(function () {
    this.route('/');
    this.route('/enter-url');
});

export default Router;
