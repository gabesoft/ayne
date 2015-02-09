var Router = Ember.Router.extend({
        rootURL  : '/'
      , location : 'history'
    });

Router.map(function () {
    this.route('/');
    this.route('/enter-url');
    this.route('/url-list');
});

export default Router;
